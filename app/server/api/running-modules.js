'use strict'
const db = require('../datalayer/running-modules')
const getConnection = require('./connection').getConnection

function getRunningModules(req, res) {
  const groupId = +req.params.groupId
  getConnection(req, res)
    .then(con => db.getRunningModules(con, groupId))
    .then(result => res.json(result))
    .catch(err => res.status(500).json(err))
}

function addModuleToRunningModules(req, res) {
  const moduleId = +req.params.moduleId
  const groupId = +req.params.groupId
  const position = +req.params.position
  getConnection(req, res)
    .then(con => db.addModuleToRunningModules(con, moduleId, groupId, position))
    .then(result => res.json(result))
    .catch(err => res.status(500).json(err))
}

function updateRunningModule(req, res) {
  const groupId = +req.params.groupId
  const position = +req.params.position
  const updates = req.body
  getConnection(req, res)
    .then(con => db.updateRunningModule(con, updates, groupId, position))
    .then(result => res.json(result))
    .catch(err => res.status(500).json(err))
}

function deleteRunningModule(req, res) {
  const groupId = +req.params.groupId
  const position = +req.params.position
  getConnection(req, res)
    .then(con => db.deleteRunningModule(con, groupId, position))
    .then(result => res.json(result))
    .catch(err => res.status(500).json(err))
}

function splitRunningModule(req, res) {
  const groupId = +req.params.groupId
  const position = +req.params.position
  getConnection(req, res)
    .then(con => db.splitRunningModule(con, groupId, position))
    .then(result => res.json(result))
    .catch(err => res.status(500).json(err))
}

module.exports = {
  getRunningModules,
  addModuleToRunningModules,
  updateRunningModule,
  deleteRunningModule,
  splitRunningModule
}
