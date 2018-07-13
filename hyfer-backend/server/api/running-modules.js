const express = require('express');
const db = require('../datalayer/running-modules');
const dbUsers = require('../datalayer/users');
const dbGroups = require('../datalayer/groups');
const dbModules = require('../datalayer/modules');
const dbHistory = require('../datalayer/history');
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

function normalizeHistory(moduleDuration, history) {
  const attendance = [];
  const homework = [];
  for (let weekNum = 0; weekNum < moduleDuration; weekNum += 1) {
    const weekData = history.find(item => item.week_num === weekNum);
    attendance.push(weekData ? weekData.attendance : 0);
    homework.push(weekData ? weekData.homework : 0);
  }
  return { attendance, homework };
}

async function getRunningModuleDetails(req, res) {
  try {
    const runningId = +req.params.runningId;
    const con = await getConnection(req, res);

    const [runningModule] = await db.getRunningModuleById(con, runningId);
    if (!runningModule) {
      throw new Error('Error fetching running module data.');
    }

    const [group] = await dbGroups.getGroupById(con, runningModule.group_id);
    if (!group) {
      throw new Error('Error fetching group data.');
    }

    const [module] = await dbModules.getModule(con, runningModule.module_id);
    if (!module) {
      throw new Error('Error fetching module data.');
    }

    let students = await dbUsers.getUsersByGroup(con, runningModule.group_id);
    const promises = students.map(student =>
      dbHistory.getStudentHistory(con, runningId, student.id));
    const histories = await Promise.all(promises);
    students = students.map((student, index) => {
      const { attendance, homework } = normalizeHistory(runningModule.duration, histories[index]);
      return Object.assign({}, student, {
        history: {
          duration: runningModule.duration,
          attendance,
          homework,
        },
      });
    });

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

async function updateNotes(req, res) {
  try {
    const { runningId } = req.params;
    const { notes } = req.body;
    const con = await getConnection(req, res);
    await db.updateNotes(con, runningId, notes);
    const [runningModule] = await db.getRunningModuleById(con, runningId);
    res.json(runningModule);
  } catch (err) {
    handleError(err, res);
  }
}

async function addTeacher(req, res) {
  try {
    const { runningId, userId } = req.params;
    const con = await getConnection(req, res);
    await db.addTeacher(con, runningId, userId);
    const teachers = await dbUsers.getTeachersByRunningModule(con, runningId);
    res.json(teachers);
  } catch (err) {
    handleError(err, res);
  }
}

async function deleteTeacher(req, res) {
  try {
    const { runningId, userId } = req.params;
    const con = await getConnection(req, res);
    await db.deleteTeacher(con, runningId, userId);
    const teachers = await dbUsers.getTeachersByRunningModule(con, runningId);
    res.json(teachers);
  } catch (err) {
    handleError(err, res);
  }
}

const router = express.Router();
router
  .get('/:groupId', hasRole('teacher'), getRunningModules)
  .get('/details/:runningId', hasRole('teacher|student'), getRunningModuleDetails)
  .patch('/update/:groupId/:position', hasRole('teacher'), updateRunningModule)
  .patch('/split/:groupId/:position', hasRole('teacher'), splitRunningModule)
  .patch('/add/:moduleId/:groupId/:position', hasRole('teacher'), addModuleToRunningModules)
  .delete('/:groupId/:position', hasRole('teacher'), deleteRunningModule)
  .post(('/teacher/:runningId/:userId'), hasRole('teacher'), addTeacher)
  .delete('/teacher/:runningId/:userId', hasRole('teacher'), deleteTeacher)
  .patch('/notes/:runningId', hasRole('teacher'), updateNotes);

module.exports = router;
