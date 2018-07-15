const {
  execQuery,
  beginTransaction,
  commit,
  rollback,
} = require('./database');
const { getCurriculumModules } = require('./modules');

const GET_GROUPS_BY_GROUP_NAME = `
  SELECT groups.starting_date, groups.group_name,
  modules.module_name,
  running_modules.duration,running_modules.id
  FROM groups
  INNER JOIN running_modules ON running_modules.group_id=groups.id
  INNER JOIN modules ON running_modules.module_id=modules.id`;

const ADD_GROUP_QUERY = 'INSERT INTO `groups` SET ?';
const UPDATE_GROUP_QUERY = 'UPDATE `groups` SET ? WHERE id = ?';
const DELETE_GROUP_QUERY = 'DELETE FROM `groups` WHERE id = ?';

const ADD_RUNNING_MODULES_QUERY = 'INSERT INTO running_modules ( module_id, group_id, duration, position) VALUES';

function getGroupsByGroupName(con, groupName) {
  return execQuery(con, `${GET_GROUPS_BY_GROUP_NAME} WHERE groups.group_name=?`, groupName);
}
function getGroups(con) {
  return execQuery(con, 'SELECT * FROM `groups` ORDER BY starting_date');
}

function getGroupById(con, groupId) {
  return execQuery(con, 'SELECT * FROM `groups` WHERE id=?', [groupId]);
}

function getActiveGroups(con) {
  return execQuery(
    con,
    'SELECT group_name FROM `groups` where archived = 0'
  );
}

function updateGroup(con, module, id) {
  return execQuery(con, UPDATE_GROUP_QUERY, [module, id]);
}

function deleteGroup(con, id) {
  return execQuery(con, DELETE_GROUP_QUERY, [id]);
}

function makeRunningModules(groupId, mods) {
  return mods.map((module, position) => ({
    module_id: module.id,
    group_id: groupId,
    duration: module.default_duration,
    position,
  }));
}

function makeValueList(runningModules) {
  let str = '';
  runningModules.forEach((module) => {
    const {
      module_id,
      group_id,
      duration,
      position,
    } = module;
    if (str.length > 0) {
      str += ',';
    }
    // eslint-disable-next-line camelcase
    str += `(${module_id},${group_id},${duration},${position})`;
  });
  return str;
}


async function addGroup(con, group) {
  const { group_name, starting_date, archived } = group;
  const data = {
    group_name,
    starting_date: new Date(starting_date),
    archived,
  };

  try {
    await beginTransaction(con);
    const { insertId: groupId } = await execQuery(con, ADD_GROUP_QUERY, data);
    const modules = await getCurriculumModules(con);
    const runningModules = makeRunningModules(groupId, modules);
    const valueList = makeValueList(runningModules);
    const sql = ADD_RUNNING_MODULES_QUERY + valueList;
    await execQuery(con, sql);
    await commit(con);
  } catch (err) {
    await rollback(con);
    throw err;
  }
}

module.exports = {
  getGroupById,
  getGroups,
  addGroup,
  updateGroup,
  deleteGroup,
  getActiveGroups,
  getGroupsByGroupName,
};
