const {
  execQuery,
  beginTransaction,
  commit,
  rollback,
} = require('./database');
const { getCurriculumModules } = require('./modules');

const GET_TIME_LINE_QUERY = `SELECT \`groups\`.id,
  \`groups\`.group_name,
  \`groups\`.starting_date,
        running_modules.duration,
        running_modules.id AS running_module_id,
        running_modules.position,
        modules.module_name,
        modules.display_name,
        modules.color,
        modules.git_url,
        modules.git_repo,
        modules.optional
    FROM \`groups\`
    INNER JOIN running_modules ON running_modules.group_id = \`groups\`.id
    INNER JOIN modules ON running_modules.module_id = modules.id
    WHERE \`groups\`.archived=0
    ORDER BY \`groups\`.starting_date, running_modules.position`;

const ADD_GROUP_QUERY = 'INSERT INTO `groups` SET ?';
const UPDATE_GROUP_QUERY = 'UPDATE `groups` SET ? WHERE id = ?';
const DELETE_GROUP_QUERY = 'DELETE FROM `groups` WHERE id = ?';

const ADD_RUNNING_MODULES_QUERY = 'INSERT INTO running_modules (description, module_id, group_id, duration, position) VALUES';

function getTimeline(con) {
  return execQuery(con, GET_TIME_LINE_QUERY);
}

function getGroups(con) {
  return execQuery(
    con,
    'SELECT id, group_name, starting_date, archived FROM `groups` ORDER BY starting_date'
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
    description: module.description,
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
      description,
      module_id,
      group_id,
      duration,
      position,
    } = module;
    if (str.length > 0) {
      str += ',';
    }
    // eslint-disable-next-line camelcase
    str += `('${description}',${module_id},${group_id},${duration},${position})`;
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
  getTimeline,
  getGroups,
  addGroup,
  updateGroup,
  deleteGroup,
};
