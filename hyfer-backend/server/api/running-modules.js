const express = require('express');
const db = require('../datalayer/running-modules');
const { getConnection } = require('./connection');
const { hasRole } = require('../auth/auth-service');
const handleError = require('./error')('running_modules');

function getRunningModules(req, res) {
  const groupId = +req.params.groupId;
  getConnection(req, res)
    .then(con => db.getRunningModules(con, groupId))
    .then(result => res.json(result))
    .catch(err => res.status(500).json(err));
}

function addModuleToRunningModules(req, res) {
  const moduleId = +req.params.moduleId;
  const groupId = +req.params.groupId;
  const position = +req.params.position;
  getConnection(req, res)
    .then(con => db.addModuleToRunningModules(con, moduleId, groupId, position))
    .then(result => res.json(result))
    .catch(err => handleError(err, res));
}

function updateRunningModule(req, res) {
  const groupId = +req.params.groupId;
  const position = +req.params.position;
  const updates = req.body;
  getConnection(req, res)
    .then(con => db.updateRunningModule(con, updates, groupId, position))
    .then(result => res.json(result))
    .catch(err => handleError(err, res));
}

function deleteRunningModule(req, res) {
  const groupId = +req.params.groupId;
  const position = +req.params.position;
  getConnection(req, res)
    .then(con => db.deleteRunningModule(con, groupId, position))
    .then(result => res.json(result))
    .catch(err => handleError(err, res));
}

function splitRunningModule(req, res) {
  const groupId = +req.params.groupId;
  const position = +req.params.position;
  getConnection(req, res)
    .then(con => db.splitRunningModule(con, groupId, position))
    .then(result => res.json(result))
    .catch(err => handleError(err, res));
}

const router = express.Router();
router
  .get('/:groupId', hasRole('teacher'), getRunningModules)
  .patch('/update/:groupId/:position', hasRole('teacher'), updateRunningModule)
  .patch('/split/:groupId/:position', hasRole('teacher'), splitRunningModule)
  .patch('/add/:moduleId/:groupId/:position', hasRole('teacher'), addModuleToRunningModules)
  .delete('/:groupId/:position', hasRole('teacher'), deleteRunningModule);

module.exports = router;
