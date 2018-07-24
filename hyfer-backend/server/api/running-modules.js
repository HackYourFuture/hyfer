const express = require('express');
const db = require('../datalayer/running-modules');
const dbUsers = require('../datalayer/users');
const dbGroups = require('../datalayer/groups');
const dbModules = require('../datalayer/modules');
const dbHistory = require('../datalayer/history');
const { getConnection } = require('./connection');
const { hasRole } = require('../auth/auth-service');
const handleError = require('./error')('Running Modules');
const logger = require('../util/logger');

async function getTimeline(req, res) {
  try {
    const con = await getConnection(req, res);
    const timeline = await db.getTimeline(con, req.query.group);
    res.json(timeline);
  } catch (err) {
    handleError(req, res, err);
  }
}

async function getRunningModuleDetails(req, res) {
  try {
    const runningId = +req.params.runningId;
    const con = await getConnection(req, res);

    const [runningModule] = await db.getRunningModuleById(con, runningId);

    const [group] = await dbGroups.getGroupById(con, runningModule.group_id);
    if (!group) {
      const error = `Group ${runningModule.group_id} not found.`;
      logger.error(error);
      res.status(404).json({ error });
      return;
    }

    const [module] = await dbModules.getModule(con, runningModule.module_id);
    if (!module) {
      const error = `Module ${runningModule.module_id} not found.`;
      logger.error(error);
      res.status(404).json({ error });
      return;
    }

    let students = await dbUsers.getUsersByGroup(con, runningModule.group_id);

    const promises = students.map(student =>
      dbHistory.getHistory(con, runningId, student.id));
    const histories = await Promise.all(promises);
    students = students.map((student, index) => ({ ...student, history: histories[index] }));

    const teachers = await dbUsers.getTeachersByRunningModule(con, runningId);

    res.json({
      notes: runningModule.notes,
      module,
      group,
      students,
      teachers,
    });
  } catch (err) {
    logger.error(err);
    res.status(500).json(err);
  }
}

async function addRunningModule(req, res) {
  try {
    const { moduleId, groupId, position } = req.params;
    const con = await getConnection(req, res);
    await db.addRunningModule(con, +moduleId, +groupId, +position);
    const timeline = await db.getTimeline(con, req.query.group);
    res.json(timeline);
    logger.info('Added running module', { ...req.params, requester: req.user.username });
  } catch (err) {
    handleError(req, res, err);
  }
}

async function updateRunningModule(req, res) {
  try {
    const { groupId, position } = req.params;
    const updates = req.body;
    const con = await getConnection(req, res);
    await db.updateRunningModule(con, updates, +groupId, +position);
    const timeline = await db.getTimeline(con, req.query.group);
    res.json(timeline);
    logger.info('Updated running module', { ...req.params, ...req.body, requester: req.user.username });
  } catch (err) {
    handleError(req, res, err);
  }
}

async function deleteRunningModule(req, res) {
  try {
    const { groupId, position } = req.params;
    const con = await getConnection(req, res);
    await db.deleteRunningModule(con, +groupId, +position);
    const timeline = await db.getTimeline(con, req.query.group);
    res.json(timeline);
    logger.info('Deleted running module', { ...req.params, requester: req.user.username });
  } catch (err) {
    handleError(req, res, err);
  }
}

async function splitRunningModule(req, res) {
  try {
    const { groupId, position } = req.params;
    const con = await getConnection(req, res);
    await db.splitRunningModule(con, +groupId, +position);
    const timeline = await db.getTimeline(con, req.query.group);
    res.json(timeline);
    logger.info('Splitted running module', { ...req.params, requester: req.user.username });
  } catch (err) {
    handleError(req, res, err);
  }
}

async function updateNotes(req, res) {
  try {
    const { runningId } = req.params;
    const { notes } = req.body;
    const con = await getConnection(req, res);
    await db.updateNotes(con, runningId, notes);
    const [runningModule] = await db.getRunningModuleById(con, +runningId);
    res.json(runningModule.notes);
    logger.info('Saved module', { ...req.params, requester: req.user.username });
  } catch (err) {
    handleError(req, res, err);
  }
}

async function addTeacher(req, res) {
  try {
    const { runningId, userId } = req.params;
    const con = await getConnection(req, res);
    await db.addTeacher(con, runningId, +userId);
    const teachers = await dbUsers.getTeachersByRunningModule(con, +runningId);
    res.json(teachers);
    logger.info('Added teacher', { ...req.params, requester: req.user.username });
  } catch (err) {
    handleError(req, res, err);
  }
}

async function deleteTeacher(req, res) {
  try {
    const { runningId, userId } = req.params;
    const con = await getConnection(req, res);
    await db.deleteTeacher(con, runningId, +userId);
    const teachers = await dbUsers.getTeachersByRunningModule(con, +runningId);
    res.json(teachers);
    logger.info('Deleted teacher', { ...req.params, requester: req.user.username });
  } catch (err) {
    handleError(req, res, err);
  }
}

const router = express.Router();
router
  .get('/timeline', getTimeline)
  .get('/details/:runningId', hasRole('teacher|student'), getRunningModuleDetails)
  .patch('/update/:groupId/:position', hasRole('teacher'), updateRunningModule)
  .patch('/split/:groupId/:position', hasRole('teacher'), splitRunningModule)
  .patch('/add/:moduleId/:groupId/:position', hasRole('teacher'), addRunningModule)
  .delete('/:groupId/:position', hasRole('teacher'), deleteRunningModule)
  .post(('/teacher/:runningId/:userId'), hasRole('teacher'), addTeacher)
  .delete('/teacher/:runningId/:userId', hasRole('teacher'), deleteTeacher)
  .patch('/notes/:runningId', hasRole('student|teacher'), updateNotes);

module.exports = router;
