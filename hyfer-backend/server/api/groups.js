const express = require('express');
const db = require('../datalayer/groups');
const handleError = require('./error')('Groups');
const { hasRole } = require('../auth/auth-service');
const { getConnection } = require('./connection');
const logger = require('../util/logger');

async function getGroups(req, res) {
  try {
    const con = await getConnection(req, res);
    const result = await db.getGroups(con);
    res.json(result);
  } catch (err) {
    handleError(req, res, err);
  }
}

async function getGroupsByGroupName(req, res) {
  try {
    const con = await getConnection(req, res);
    const result = await db.getGroupsByGroupName(con, req.params.group_name);
    res.json(result);
  } catch (err) {
    handleError(req, res, err);
  }
}

async function addGroup(req, res) {
  try {
    const con = await getConnection(req, res);
    await db.addGroup(con, req.body);
    res.sendStatus(201);
    logger.info('Add group', { ...req.params, ...req.body, requester: req.user.username });
  } catch (err) {
    handleError(req, res, err);
  }
}

async function updateGroup(req, res) {
  try {
    const con = await getConnection(req, res);
    const result = await db.updateGroup(con, req.body, +req.params.id);
    res.sendStatus(result.affectedRows > 0 ? 204 : 404);
    logger.info('Update group', { ...req.params, ...req.body, requester: req.user.username });
  } catch (err) {
    handleError(req, res, err);
  }
}

async function deleteGroup(req, res) {
  try {
    const con = await getConnection(req, res);
    const result = await db.deleteGroup(con, +req.params.id);
    res.statusStatus(result.affectedRows > 0 ? 204 : 404);
    logger.info('Delete group', { ...req.params, ...req.body, requester: req.user.username });
  } catch (err) {
    handleError(req, res, err);
  }
}

const router = express.Router();
router
  .get('/', getGroups)
  .get('/currentgroups/:group_name', hasRole('teacher|student'), getGroupsByGroupName)
  .post('/', hasRole('teacher'), addGroup)
  .patch('/:id', hasRole('teacher'), updateGroup)
  .delete('/:id', hasRole('teacher'), deleteGroup);

module.exports = router;
