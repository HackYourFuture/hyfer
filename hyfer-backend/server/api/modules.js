const express = require('express');
const _ = require('lodash');
const db = require('../datalayer/modules');
const { getConnection } = require('./connection');
const { hasRole } = require('../auth/auth-service');
const handleError = require('./error')('Modules');
const logger = require('../util/logger.js');

async function getModules(req, res) {
  try {
    const con = await getConnection(req, res);
    const result = await db.getModules(con);
    res.json(result);
  } catch (err) {
    handleError(req, res, err);
  }
}

async function getHomeworkModules(req, res) {
  try {
    const con = await getConnection(req, res);
    const result = await db.getHomeworkModules(con);
    res.json(result);
  } catch (err) {
    handleError(req, res, err);
  }
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

async function bulkUpdateModules(req, res) {
  const receivedModules = req.body;
  try {
    const con = await getConnection(req, res);
    const currentModules = await db.getModules(con);
    const batchUpdate = createBatchUpdate(currentModules, receivedModules);
    await db.updateModules(con, batchUpdate);
    const result = await db.getModules(con);
    res.json(result);
    logger.info('Bulk-updated modules', { requester: req.user.username });
  } catch (err) {
    handleError(req, res, err);
  }
}

const router = express.Router();
router
  .get('/', hasRole('teacher|student'), getModules)
  .patch('/', hasRole('teacher'), bulkUpdateModules)
  .get('/homework', hasRole('teacher|student'), getHomeworkModules);

module.exports = router;
