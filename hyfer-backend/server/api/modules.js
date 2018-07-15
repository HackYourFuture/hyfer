const express = require('express');
const _ = require('lodash');
const db = require('../datalayer/modules');
const { getConnection } = require('./connection');
const { hasRole } = require('../auth/auth-service');
const handleError = require('./error')('modules');

function getModules(req, res) {
  getConnection(req, res)
    .then(con => db.getModules(con))
    .then(result => res.json(result))
    .catch(err => handleError(err, res));
}

function getHomeworkModules(req, res) {
  getConnection(req, res)
    .then(con => db.getHomeworkModules(con))
    .then(result => res.json(result))
    .catch(err => handleError(err, res));
}

function addModule(req, res) {
  getConnection(req, res)
    .then(con => db.addModule(con, req.body))
    .then(() => res.sendStatus(200))
    .catch(err => handleError(err, res));
}

function updateModule(req, res) {
  getConnection(req, res)
    .then(con => db.updateModule(con, req.body, req.params.id))
    .then(result => res.sendStatus(result.affectedRows > 0 ? 200 : 404))
    .catch(err => handleError(err, res));
}

function deleteModule(req, res) {
  getConnection(req, res)
    .then(con => db.deleteModule(con, req.params.id))
    .then(result => res.sendStatus(result.affectedRows > 0 ? 200 : 404))
    .catch(err => handleError(err, res));
}

function compareModules(mod1, mod2) {
  return (
    mod1.id === mod2.id &&
    mod1.module_name === mod2.module_name &&
    mod1.default_duration === mod2.default_duration &&
    mod1.sort_order === mod2.sort_order &&
    mod1.git_url === mod2.git_url &&
    mod1.git_owner === mod2.git_owner &&
    mod1.git_repo === mod2.git_repo &&
    mod1.color === mod2.color &&
    mod1.optional === mod2.optional &&
    mod1.has_homework === mod2.has_homework
  );
}

function createBatchUpdate(currentModules, receivedModules) {
  const receivedMods = receivedModules
    .map((module, index) => {
      const sortOrder = module.optional ? 1000 : index;
      return Object.assign({}, module, { sort_order: sortOrder });
    });

  const currentMods = currentModules.map(module =>
    Object.assign({}, module, { visited: false }));

  const updates = [];
  const additions = [];

  receivedMods.forEach((receivedMod) => {
    const currentMod = currentMods.find(module => module.id === receivedMod.id);
    if (!currentMod) {
      additions.push(_.omit(receivedMod, 'id'));
    } else if (!compareModules(currentMod, receivedMod)) {
      currentMod.visited = true;
      updates.push(receivedMod);
    } else {
      currentMod.visited = true;
    }
  });

  const deletions = currentMods.filter(currentMod => !currentMod.visited);

  return { updates, additions, deletions };
}

async function updateModules(req, res) {
  const receivedModules = req.body;
  try {
    const con = await getConnection(req, res);
    const currentModules = await db.getModules(con);
    const batchUpdate = createBatchUpdate(currentModules, receivedModules);
    await db.updateModules(con, batchUpdate);
    const result = await db.getModules(con);
    res.json(result);
  } catch (err) {
    handleError(err, res);
  }
}

const router = express.Router();
router
  .get('/', hasRole('teacher|student'), getModules)
  .get('/homework', hasRole('teacher|student'), getHomeworkModules)
  .post('/', hasRole('teacher|student'), addModule)
  .patch('/', hasRole('teacher'), updateModules)
  .patch('/:id', hasRole('teacher'), updateModule)
  .delete('/:id', hasRole('teacher'), deleteModule);

module.exports = router;
