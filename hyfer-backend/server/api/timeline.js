const express = require('express');
const _ = require('lodash');
const handleError = require('./error')('timeline');
const db = require('../datalayer/groups');
const { getConnection } = require('./connection');

async function getTimeline(req, res) {
  try {
    const con = await getConnection(req, res);
    const result = await db.getTimeline(con);
    const groupedModules = _.groupBy(result, module => module.group_name);
    res.json(groupedModules);
  } catch (err) {
    handleError(err, res);
  }
}

const api = express.Router();
api.get('/', getTimeline);

module.exports = api;
