const express = require('express');
const _ = require('lodash');
const handleError = require('./error')('timeline');
const db = require('../datalayer/groups');
const { getConnection } = require('./connection');

async function getTimeline(req, res) {
  try {
    const con = await getConnection(req, res);
    const rows = await db.getTimeline(con);
    const grouped = _.groupBy(rows, row => row.group_name);

    const timeline = Object.keys(grouped)
      .reduce((acc, groupName) => {
        let modules = grouped[groupName];
        const { id: group_id, starting_date } = modules[0];
        modules = modules.map(m => ({
          duration: m.duration,
          git_repo: m.git_repo,
          module_name: m.module_name,
          position: m.position,
          running_module_id: m.running_module_id,
          color: m.color,
        }));
        acc[groupName] = {
          group_id,
          starting_date,
          modules,
        };
        return acc;
      }, {});

    res.json(timeline);
  } catch (err) {
    handleError(err, res);
  }
}
const api = express.Router();
api.get('/', getTimeline);

module.exports = api;
