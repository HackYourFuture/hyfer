
const express = require('express');
const db = require('../datalayer/users');
const { getConnection } = require('./connection');
const { hasRole, isAuthenticated } = require('../auth/auth-service');
const handleError = require('./error')('users');

async function getCurrentUser(req, res) {
  try {
    const con = await getConnection(req, res);
    const [result] = await db.getUserByUsername(con, req.user.username);
    res.json(result);
  } catch (err) {
    handleError(err, res);
  }
}

async function getUsers(req, res) {
  try {
    const con = await getConnection(req, res);
    const result = await db.getUsers(con);
    res.json(result);
  } catch (err) {
    handleError(err, res);
  }
}

async function getLastEvent(req, res) {
  try {
    const con = await getConnection(req, res);
    const result = await db.getLastEvent(con, req.params.eventName);
    res.json(result);
  } catch (err) {
    handleError(err, res);
  }
}


async function getTeachers(req, res) {
  try {
    const con = await getConnection(req, res);
    const result = await db.getTeachers(con);
    res.json(result);
  } catch (err) {
    handleError(err, res);
  }
}

function getUserById(req, res) {
  getConnection(req, res)
    .then(con => db.getUserById(con, +req.params.id))
    .then(result => res.json(result[0]))
    .catch(err => handleError(err, res));
}

function getTeachersByRunningModule(req, res) {
  getConnection(req, res)
    .then(con => db.getTeachersByRunningModule(con, +req.params.id))
    .then(result => res.json(result))
    .catch(err => handleError(err, res));
}


function getRunningUsersByGroup(req, res) {
  getConnection(req, res)
    .then(con => db.getRunningUsersByGroup(con, +req.params.groupId))
    .then(result => res.json(result))
    .catch(err => handleError(err, res));
}

function updateUser(req, res) {
  getConnection(req, res)
    .then(con => db.updateUser(con, +req.params.id, req.body))
    .then(() => res.sendStatus(204))
    .catch(err => handleError(err, res));
}

const router = express.Router();
router
  .get('/', isAuthenticated(), getCurrentUser)
  .get('/teachers/:id', hasRole('teacher|student'), getTeachersByRunningModule)
  .get('/event/:eventName', hasRole('teacher'), getLastEvent)
  .get('/all', hasRole('teacher'), getUsers)
  .get('/teachers', hasRole('teacher'), getTeachers)
  .get('/group/:groupId', hasRole('teacher|student'), getRunningUsersByGroup)
  .get('/:id', hasRole('teacher|student'), getUserById)
  .patch('/:id', hasRole('teacher|student'), updateUser);

module.exports = router;
