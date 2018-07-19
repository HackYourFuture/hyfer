const express = require('express');
const db = require('../datalayer/history');
const handleError = require('./error')('history');
const { hasRole } = require('../auth/auth-service');
const { getConnection } = require('./connection');

async function save(req, res) {
  try {
    const { runningId, userId, weekNum } = req.params;
    const { attendance, homework } = req.body;
    const con = await getConnection(req, res);
    const result = await db.saveHistory(con, {
      runningId,
      userId,
      weekNum,
      attendance,
      homework,
    });
    res.json(result);
  } catch (err) {
    handleError(err, res);
  }
}

const router = express.Router();
router
  .post('/:runningId/:userId/:weekNum', hasRole('teacher'), save);

module.exports = router;
