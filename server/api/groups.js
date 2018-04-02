'use strict'
const _ = require('lodash')
const db = require('../datalayer/groups')
const { getConnection } = require('./connection')

function getTimeline(req, res) {
  getConnection(req, res)
    .then(con => db.getTimeline(con))
    .then(result => {
      const groupedModules = _.groupBy(result, module => module.group_name)
      res.json(groupedModules)
    })
    .catch(err => {
      console.log(err)
      res.sendStatus(500)
    })
}

function getGroups(req, res) {
  getConnection(req, res)
    .then(con => db.getGroups(con))
    .then(result => res.json(result))
    .catch(err => {
      console.log(err)
      res.sendStatus(500)
    })
}

function addGroup(req, res) {
  getConnection(req, res)
    .then(con => db.addGroup(con, req.body))
    .then(() => res.sendStatus(204))
    .catch(err => {
      console.log(err)
      res.sendStatus(500)
    })
}

function updateGroup(req, res) {
  getConnection(req, res)
    .then(con => db.updateGroup(con, req.body, +req.params.id))
    .then(result => res.sendStatus(result.affectedRows > 0 ? 204 : 404))
    .catch(err => {
      console.log(err)
      res.sendStatus(500)
    })
}

function deleteGroup(req, res) {
  getConnection(req, res)
    .then(con => db.deleteGroup(con, +req.params.id))
    .then(result => res.statusStatus(result.affectedRows > 0 ? 204 : 404))
    .catch(err => {
      console.log(err)
      res.sendStatus(500)
    })
}

module.exports = {
  getTimeline,
  getGroups,
  addGroup,
  updateGroup,
  deleteGroup
}
