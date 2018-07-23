
const express = require('express');
const _ = require('lodash');
const db = require('../datalayer/users');
const { getConnection } = require('./connection');
const { hasRole, isAuthenticated } = require('../auth/auth-service');
const handleError = require('./error')('Users');
const logger = require('../util/logger');

async function getCurrentUser(req, res) {
  try {
    const con = await getConnection(req, res);
    const [result] = await db.getUserByUsername(con, req.user.username);
    const { username, full_name, role } = result;
    logger.info(`${_.capitalize(role)} signed in`, { username, full_name });

    res.json(result);
  } catch (err) {
    handleError(req, res, err);
  }
}

async function getUsers(req, res) {
  try {
    const con = await getConnection(req, res);
    const result = await db.getUsers(con);
    res.json(result);
  } catch (err) {
    handleError(req, res, err);
  }
}

async function getLastEvent(req, res) {
  try {
    const con = await getConnection(req, res);
    const result = await db.getLastEvent(con, req.params.eventName);
    res.json(result);
  } catch (err) {
    handleError(req, res, err);
  }
}

async function getTeachers(req, res) {
  try {
    const con = await getConnection(req, res);
    const result = await db.getTeachers(con);
    res.json(result);
  } catch (err) {
    handleError(req, res, err);
  }
}

function getUserById(req, res) {
  getConnection(req, res)
    .then(con => db.getUserById(con, +req.params.id))
    .then(result => res.json(result[0]))
    .catch(err => handleError(req, res, err));
}

function getTeachersByRunningModule(req, res) {
  getConnection(req, res)
    .then(con => db.getTeachersByRunningModule(con, +req.params.id))
    .then(result => res.json(result))
    .catch(err => handleError(req, res, err));
}


function getRunningUsersByGroup(req, res) {
  getConnection(req, res)
    .then(con => db.getRunningUsersByGroup(con, +req.params.groupId))
    .then(result => res.json(result))
    .catch(err => handleError(req, res, err));
}

async function updateUser(req, res) {
  try {
    const con = await getConnection(req, res);
    const [result] = await db.updateUser(con, +req.params.id, req.body);
    res.json(result);
    logger.info('Update user', { ...req.params, ...req.body, requester: req.user.username });
  } catch (err) {
    handleError(req, res, err);
  }
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
