const _ = require('lodash');
const {
  execQuery,
  beginTransaction,
  commit,
  rollback,
} = require('./database');

const GET_MODULE_QUERY = `SELECT id, module_name, display_name, added_on, default_duration, git_url, git_owner, git_repo, color, optional,
  (SELECT COUNT(*) 
  FROM running_modules WHERE running_modules.module_id = modules.id) AS ref_count
  FROM modules`;

const GET_HOMEWORK_MODULES_QUERY = `SELECT id, module_name AS name, default_duration AS duration, sort_order, git_url 
  FROM modules
  WHERE sort_order != 1000 AND has_homework != 0
  ORDER BY sort_order`;

const ADD_MODULE_QUERY = 'INSERT INTO modules SET ?';
const UPDATE_MODULE_QUERY = 'UPDATE modules SET ? WHERE id = ?';
const DELETE_MODULE_QUERY = 'DELETE FROM modules WHERE id = ?';

function getModule(con, id) {
  const sql = `${GET_MODULE_QUERY} WHERE id=?`;
  return execQuery(con, sql, [id]);
}

function getModules(con) {
  const sql = `${GET_MODULE_QUERY} ORDER BY sort_order, module_name`;
  return execQuery(con, sql);
}

function getHomeworkModules(con) {
  const sql = GET_HOMEWORK_MODULES_QUERY;
  return execQuery(con, sql);
}

function getCurriculumModules(con) {
  const sql = `${GET_MODULE_QUERY} WHERE optional=0 ORDER BY sort_order`;
  return execQuery(con, sql);
}

function getOptionalModules(con) {
  const sql = `${GET_MODULE_QUERY} WHERE optional!=0 ORDER BY module_name`;
  return execQuery(con, sql);
}

function addModule(con, module) {
  const obj = _.omit(module, ['id', 'added_on', 'ref_count']);
  return execQuery(con, ADD_MODULE_QUERY, obj);
}

function updateModule(con, module, id) {
  const obj = _.omit(module, ['id', 'added_on', 'ref_count']);
  return execQuery(con, UPDATE_MODULE_QUERY, [obj, id]);
}

function deleteModule(con, id) {
  return execQuery(con, DELETE_MODULE_QUERY, [id]);
}

async function updateModules(con, batchUpdate) {
  try {
    await beginTransaction(con);
    const promises = batchUpdate.updates
      .map(module => this.updateModule(con, module, module.id))
      .concat(batchUpdate.additions.map(module => this.addModule(con, module)))
      .concat(batchUpdate.deletions.map(module => this.deleteModule(con, module.id)));
    await Promise.all(promises);
    await commit;
  } catch (err) {
    await rollback(con);
    throw err;
  }
}

module.exports = {
  getModule,
  getModules,
  getHomeworkModules,
  getCurriculumModules,
  getOptionalModules,
  addModule,
  updateModule,
  deleteModule,
  updateModules,
};
