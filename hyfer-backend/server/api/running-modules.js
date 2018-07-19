const express = require('express');
const db = require('../datalayer/running-modules');
const dbUsers = require('../datalayer/users');
const dbGroups = require('../datalayer/groups');
const dbModules = require('../datalayer/modules');
const dbHistory = require('../datalayer/history');
const { getConnection } = require('./connection');
const { hasRole } = require('../auth/auth-service');
const handleError = require('./error')('running_modules');

async function getTimeline(req, res) {
  try {
    const con = await getConnection(req, res);
    const timeline = await db.getTimeline(con);
    res.json(timeline);
  } catch (err) {
    handleError(err, res);
  }
}

function getRunningModules(req, res) {
  const groupId = +req.params.groupId;
  getConnection(req, res)
    .then(con => db.getRunningModules(con, groupId))
    .then(result => res.json(result))
    .catch(err => res.status(500).json(err));
}

async function getRunningModuleDetails(req, res) {
  try {
    const runningId = +req.params.runningId;
    const con = await getConnection(req, res);

    const [runningModule] = await db.getRunningModuleById(con, runningId);
    if (!runningModule) {
      res.status(404).json({ error: `Running module ${runningId} not found.` });
      return;
    }

    const [group] = await dbGroups.getGroupById(con, runningModule.group_id);
    if (!group) {
      res.status(404).json({ error: `Group ${runningModule.group_id} not found.` });
      return;
    }

    const [module] = await dbModules.getModule(con, runningModule.module_id);
    if (!module) {
      res.status(404).json({ error: `Module ${runningModule.module_id} not found.` });
      return;
    }

    let students = await dbUsers.getUsersByGroup(con, runningModule.group_id);

    const promises = students.map(student =>
      dbHistory.getHistory(con, runningId, student.id));
    const histories = await Promise.all(promises);
    students = students.map((student, index) => ({ ...student, history: histories[index] }));

    const teachers = await dbUsers.getTeachersByRunningModule(con, runningId);

    res.json({
      runningModule,
      module,
      group,
      students,
      teachers,
    });
  } catch (err) {
    res.status(500).json(err);
  }
}

async function addRunningModule(req, res) {
  try {
    const { moduleId, groupId, position } = req.params;
    const con = await getConnection(req, res);
    await db.addRunningModule(con, +moduleId, +groupId, +position);
    const timeline = await db.getTimeline(con);
    res.json(timeline);
  } catch (err) {
    handleError(err, res);
  }
}

async function updateRunningModule(req, res) {
  try {
    const { groupId, position } = req.params;
    const updates = req.body;
    const con = await getConnection(req, res);
    await db.updateRunningModule(con, updates, +groupId, +position);
    const timeline = await db.getTimeline(con);
    res.json(timeline);
  } catch (err) {
    handleError(err, res);
  }
}

async function deleteRunningModule(req, res) {
  try {
    const { groupId, position } = req.params;
    const con = await getConnection(req, res);
    await db.deleteRunningModule(con, +groupId, +position);
    const timeline = await db.getTimeline(con);
    res.json(timeline);
  } catch (err) {
    handleError(err, res);
  }
}

async function splitRunningModule(req, res) {
  try {
    const { groupId, position } = req.params;
    const con = await getConnection(req, res);
    await db.splitRunningModule(con, +groupId, +position);
    const timeline = await db.getTimeline(con);
    res.json(timeline);
  } catch (err) {
    handleError(err, res);
  }
}

async function updateNotes(req, res) {
  try {
    const { runningId } = req.params;
    const { notes } = req.body;
    const con = await getConnection(req, res);
    await db.updateNotes(con, runningId, notes);
    const [runningModule] = await db.getRunningModuleById(con, +runningId);
    res.json(runningModule);
  } catch (err) {
    handleError(err, res);
  }
}

async function addTeacher(req, res) {
  try {
    const { runningId, userId } = req.params;
    const con = await getConnection(req, res);
    await db.addTeacher(con, runningId, +userId);
    const teachers = await dbUsers.getTeachersByRunningModule(con, +runningId);
    res.json(teachers);
  } catch (err) {
    handleError(err, res);
  }
}

async function deleteTeacher(req, res) {
  try {
    const { runningId, userId } = req.params;
    const con = await getConnection(req, res);
    await db.deleteTeacher(con, runningId, +userId);
    const teachers = await dbUsers.getTeachersByRunningModule(con, +runningId);
    res.json(teachers);
  } catch (err) {
    handleError(err, res);
  }
}

const router = express.Router();
router
  .get('/timeline', getTimeline)
  .get('/:groupId', hasRole('teacher'), getRunningModules)
  .get('/details/:runningId', hasRole('teacher|student'), getRunningModuleDetails)
  .patch('/update/:groupId/:position', hasRole('teacher'), updateRunningModule)
  .patch('/split/:groupId/:position', hasRole('teacher'), splitRunningModule)
  .patch('/add/:moduleId/:groupId/:position', hasRole('teacher'), addRunningModule)
  .delete('/:groupId/:position', hasRole('teacher'), deleteRunningModule)
  .post(('/teacher/:runningId/:userId'), hasRole('teacher'), addTeacher)
  .delete('/teacher/:runningId/:userId', hasRole('teacher'), deleteTeacher)
  .patch('/notes/:runningId', hasRole('teacher'), updateNotes);

module.exports = router;
