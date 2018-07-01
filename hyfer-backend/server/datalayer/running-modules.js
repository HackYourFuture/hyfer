const {
  execQuery,
  beginTransaction,
  commit,
  rollback,
} = require('./database');
const modules = require('./modules');

const GET_RUNNING_MODULES_QUERY = 'SELECT duration, teacher1_id, teacher2_id FROM running_modules';
const GET_ALL_FROM_RUNNING_MODULES_QUERY = 'SELECT * FROM running_modules';
const DELETE_ALL_RUNNING_MODULES_QUERY = 'DELETE FROM running_modules WHERE group_id=?';
const INSERT_RUNNING_MODULES_QUERY = `INSERT INTO running_modules 
  (module_id, group_id, duration, position, teacher1_id, teacher2_id) VALUES ?`;

function getRunningModules(con, groupId) {
  const sql = `${GET_RUNNING_MODULES_QUERY} WHERE group_id=? ORDER BY position`;
  return execQuery(con, sql, [groupId]);
}

function getAllFromRunningModules(con, groupId) {
  const sql = `${GET_ALL_FROM_RUNNING_MODULES_QUERY} WHERE group_id=? ORDER BY position`;
  return execQuery(con, sql, [groupId]);
}

function insertRunningModuleAtIndex(runningMods, targetMod, position) {
  if (position >= 0 && position <= runningMods.length) {
    runningMods.splice(position, 0, targetMod);
  } else {
    runningMods.push(targetMod);
  }
}

function resequenceRunningModules(runningMods) {
  return runningMods.map((module, position) => Object.assign({}, module, { position }));
}

function makeValueList(runningModules) {
  return runningModules.reduce((values, mod) => {
    values.push([
      mod.module_id,
      mod.group_id,
      mod.duration,
      mod.position,
      mod.teacher1_id,
      mod.teacher2_id,
    ]);
    return values;
  }, []);
}

async function replaceRunningModules(con, runningMods, groupId) {
  try {
    await beginTransaction(con);
    await execQuery(con, DELETE_ALL_RUNNING_MODULES_QUERY, groupId);
    const values = makeValueList(runningMods);
    await execQuery(con, INSERT_RUNNING_MODULES_QUERY, [values]);
    await commit(con);
    return getAllFromRunningModules(con, groupId);
  } catch (err) {
    await rollback(con);
    throw err;
  }
}

async function addModuleToRunningModules(con, moduleId, groupId, position) {
  const [module] = await modules.getModule(con, moduleId);
  const newMod = {
    description: module.description,
    module_id: moduleId,
    group_id: groupId,
    duration: module.default_duration,
    teacher1_id: null,
    teacher2_id: null,
  };
  const runningMods = await getAllFromRunningModules(con, groupId);
  insertRunningModuleAtIndex(runningMods, newMod, position);
  const resequencedModules = resequenceRunningModules(runningMods);
  return replaceRunningModules(con, resequencedModules, groupId);
}

async function updateRunningModule(con, updates, groupId, position) {
  const runningMods = await getAllFromRunningModules(con, groupId);
  const targetMod = runningMods[position];
  runningMods.splice(position, 1);
  Object.assign(targetMod, updates);
  insertRunningModuleAtIndex(
    runningMods,
    targetMod,
    updates.position || position
  );
  const resequencedModules = resequenceRunningModules(runningMods);
  return replaceRunningModules(con, resequencedModules, groupId);
}

async function deleteRunningModule(con, groupId, position) {
  let runningMods = await getAllFromRunningModules(con, groupId);
  runningMods = runningMods.filter(mod => mod.position !== position);
  const resequencedModules = resequenceRunningModules(runningMods);
  return replaceRunningModules(con, resequencedModules, groupId);
}

async function splitRunningModule(con, groupId, position) {
  const runningMods = await getAllFromRunningModules(con, groupId);
  const newMod = Object.assign({}, runningMods[position]);
  if (newMod.duration === 1) {
    return Promise.resolve();
  }
  newMod.duration = Math.floor(newMod.duration / 2);
  runningMods[position].duration -= newMod.duration;
  runningMods.splice(position, 0, newMod);
  resequenceRunningModules(runningMods);
  return replaceRunningModules(con, runningMods, groupId);
}

module.exports = {
  getRunningModules,
  addModuleToRunningModules,
  updateRunningModule,
  deleteRunningModule,
  splitRunningModule,
};
