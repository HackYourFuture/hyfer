const express = require('express');
const db = require('../datalayer/history');
const handleError = require('./error')('History');
const { hasRole } = require('../auth/auth-service');
const { getConnection } = require('./connection');
const logger = require('../util/logger');

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
    logger.debug('Saved attendance', {
      userId,
      runningId,
      weekNum,
      attendance,
      homework,
      requester: req.user.username,
    });
  } catch (err) {
    handleError(req, res, err);
  }
}

const router = express.Router();
router
  .post('/:runningId/:userId/:weekNum', hasRole('teacher'), save);

module.exports = router;
