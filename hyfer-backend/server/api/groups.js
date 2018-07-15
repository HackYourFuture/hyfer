const express = require('express');
const db = require('../datalayer/groups');
const handleError = require('./error')('groups');
const { hasRole } = require('../auth/auth-service');
const { getConnection } = require('./connection');

function getGroups(req, res) {
  getConnection(req, res)
    .then(con => db.getGroups(con))
    .then(result => res.json(result))
    .catch(err => handleError(err, res));
}

function getGroupsByGroupName(req, res) {
  getConnection(req, res)
    .then(con => db.getGroupsByGroupName(con, req.params.group_name))
    .then(result => res.json(result))
    .catch(err => handleError(err, res));
}

function addGroup(req, res) {
  getConnection(req, res)
    .then(con => db.addGroup(con, req.body))
    .then(() => res.sendStatus(201))
    .catch(err => handleError(err, res));
}

function updateGroup(req, res) {
  getConnection(req, res)
    .then(con => db.updateGroup(con, req.body, +req.params.id))
    .then(result => res.sendStatus(result.affectedRows > 0 ? 204 : 404))
    .catch(err => handleError(err, res));
}

function deleteGroup(req, res) {
  getConnection(req, res)
    .then(con => db.deleteGroup(con, +req.params.id))
    .then(result => res.statusStatus(result.affectedRows > 0 ? 204 : 404))
    .catch(err => handleError(err, res));
}

const router = express.Router();
router
  .get('/', getGroups)
  .get('/currentgroups/:group_name', hasRole('teacher|student'), getGroupsByGroupName)
  .post('/', hasRole('teacher'), addGroup)
  .patch('/:id', hasRole('teacher'), updateGroup)
  .delete('/:id', hasRole('teacher'), deleteGroup);

module.exports = router;
