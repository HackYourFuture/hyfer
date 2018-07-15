const express = require('express');
const db = require('../datalayer/history');
const handleError = require('./error')('history');
const { isAuthenticated } = require('../auth/auth-service');
const { getConnection } = require('./connection');
const states = require('../datalayer/states');

async function getHistory(req, res) {
  const { moduleId, groupId } = req.params;
  const { sundays } = req.body;

  try {
    const con = await getConnection(req, res);
    const history = await db.getHistory(con, moduleId);
    const students = await states.getStudentsState(con, groupId);

    const lookup = {};
    const out = {};

    students.forEach((student) => {
      sundays.forEach((sunday) => {
        const att = {
          attendance: 0,
          homework: 0,
          group_id: student.group_id,
          full_name: student.full_name,
          user_id: student.user_id,
          username: student.username,
          running_module_id: moduleId,
          date: sunday,
        };
        lookup[`${sunday}_${student.user_id}`] = att;
        const grouped =
          out[student.full_name] || (out[student.full_name] = []);
        grouped.push(att);
      });
    });
    history.forEach((h) => {
      const att = lookup[`${h.date}_${h.user_id}`];
      if (att) {
        att.attendance = h.attendance;
        att.homework = h.homework;
      }
    });
    res.json(out);
  } catch (err) {
    handleError(err, res);
  }
}

function orderAndGetList(histories) {
  const list = [];
  let arr = [];
  Object.keys(histories).forEach((key) => {
    histories[key].forEach((history) => {
      const {
        date,
        group_id,
        running_module_id,
        user_id,
        attendance,
        homework,
      } = history;
      arr.push(
        date,
        group_id,
        running_module_id,
        user_id,
        attendance,
        homework
      );
      list.push(arr);
      arr = [];
    });
  });

  return list;
}

async function saveAttendances(req, res) {
  try {
    const con = await getConnection(req, res);
    const list = orderAndGetList(req.body);
    const val = await db.saveHistory(con, list);
    res.json(val);
  } catch (err) {
    handleError(err, res);
  }
}

const router = express.Router();
router
  .patch('/:moduleId/:groupId', isAuthenticated(), getHistory)
  .post('/', isAuthenticated(), saveAttendances);

module.exports = router;
