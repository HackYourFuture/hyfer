'use strict'
const db = require('../datalayer/users')
const { getConnection } = require('./connection')

function getCurrentUser(req, res) {
  getConnection(req, res)
    .then(con => db.getUserByUsername(con, req.user.username))
    .then(result => res.json(result[0]))
    .catch(err => {
      console.log(err)
      res.sendStatus(500)
    })
}

function getUsers(req, res) {
  getConnection(req, res)
    .then(con => db.getUsers(con))
    .then(result => res.json(result))
    .catch(err => {
      console.log(err)
      res.sendStatus(500)
    })
}

function getUserById(req, res) {
  getConnection(req, res)
    .then(con => db.getUserById(con, +req.params.id))
    .then(result => res.json(result[0]))
    .catch(err => {
      console.log(err)
      res.sendStatus(500)
    })
}

function updateUser(req, res) {
  getConnection(req, res)
    .then(con => db.updateUser(con, +req.params.id, req.body))
    .then(() => res.sendStatus(204))
    .catch(err => {
      console.log(err)
      res.sendStatus(500)
    })
}

module.exports = {
  getCurrentUser,
  getUsers,
  getUserById,
  updateUser
}
