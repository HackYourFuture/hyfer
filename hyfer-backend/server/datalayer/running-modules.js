/* eslint-disable camelcase */
const {
  execQuery,
  beginTransaction,
  commit,
  rollback,
} = require('./database');
const modules = require('./modules');

const GET_RUNNING_MODULES_QUERY =
  'SELECT * FROM running_modules';
const GET_RUNNING_MODULE_BY_ID =
  'SELECT * FROM running_modules WHERE id=?';
const UPDATE_RUNNING_MODULE =
  'UPDATE running_modules SET duration=?, position=?, notes=? WHERE id=?';
const DELETE_RUNNING_MODULE =
  'DELETE FROM running_modules WHERE id=?';
const INSERT_RUNNING_MODULE =
  'INSERT INTO running_modules (module_id, group_id, duration, position, notes) VALUES(?,?,?,?,?)';

const resequenceModules = mods => mods.map((mod, index) => ({ ...mod, position: index }));

function getRunningModuleById(con, runningId) {
  const sql = GET_RUNNING_MODULE_BY_ID;
  return execQuery(con, sql, [runningId]);
}

function getRunningModules(con, groupId) {
  const sql = `${GET_RUNNING_MODULES_QUERY} WHERE group_id=? ORDER BY position`;
  return execQuery(con, sql, [groupId]);
}

async function bulkUpdateRunningsModules(con, existingMods, updatedMods, groupId) {
  if (existingMods.length !== updatedMods.length) {
    throw new Error('Error updating running modules: length mismatch.');
  }

  const inserts = updatedMods.filter(mod => mod.id === undefined);
  const deletes = existingMods.filter(mod1 => !updatedMods.find(mod2 => mod1.id === mod2.id));
  const updates = updatedMods.filter((mod) => {
    const existingMod = existingMods.find(mod2 => mod.id === mod2.id);
    if (existingMod === null) {
      throw new Error('Error updating running modules: cannot find matching module.');
    }
    return existingMod.duration !== mod.duration
      || existingMod.position !== mod.position
      || existingMod.notes !== mod.notes;
  });

  const insertPromises = inserts.map((mod) => {
    const {
      module_id,
      group_id,
      duration,
      position,
      notes,
    } = mod;
    return execQuery(con, INSERT_RUNNING_MODULE, [
      module_id,
      group_id,
      duration,
      position,
      notes || '',
    ]);
  });

  const deletePromises = deletes.map(mod => execQuery(con, DELETE_RUNNING_MODULE, [mod.id]));

  const updatePromises = updates.map((mod) => {
    const {
      duration,
      position,
      notes,
      id,
    } = mod;
    return execQuery(con, UPDATE_RUNNING_MODULE, [
      duration,
      position,
      notes || '',
      id,
    ]);
  });

  const allPromises = [...insertPromises, ...deletePromises, ...updatePromises];
  if (allPromises.length > 0) {
    try {
      await beginTransaction(con);
      await Promise.all(updatePromises);
      await commit(con);
    } catch (err) {
      await rollback(con);
      throw err;
    }
  }

  return getRunningModules(con, groupId);
}

async function updateRunningModule(con, updates, groupId, position) {
  const existingMods = await getRunningModules(con, groupId);
  const targetMod = { ...existingMods[position], ...updates };

  let updatedMods = [...existingMods];
  updatedMods.splice(position, 1);
  updatedMods.splice(updates.position || position, 0, targetMod);
  updatedMods = resequenceModules(updatedMods);

  return bulkUpdateRunningsModules(con, existingMods, updatedMods, groupId);
}

async function deleteRunningModule(con, groupId, position) {
  const existingMods = await getRunningModules(con, groupId);
  let updatedMods = existingMods.filter(mod => mod.position !== position);
  updatedMods = resequenceModules(updatedMods);

  return bulkUpdateRunningsModules(con, existingMods, updatedMods, groupId);
}

async function addRunningModule(con, moduleId, groupId, position) {
  const [module] = await modules.getModule(con, moduleId);
  const { module_id, default_duration: duration } = module;

  const newMod = {
    module_id,
    group_id: groupId,
    duration,
    position,
    notes: '',
  };

  const existingMods = await getRunningModules(con, groupId);
  let updatedMods = [...existingMods];
  updatedMods.splice(position, 0, newMod);
  updatedMods = resequenceModules(updatedMods);

  await bulkUpdateRunningsModules(con, existingMods, updatedMods);
  return getRunningModules(con, groupId);
}

async function splitRunningModule(con, groupId, position) {
  const existingMods = await getRunningModules(con, groupId);

  const {
    module_id,
    group_id,
    notes,
    duration,
  } = existingMods[position];

  // Can't split a one week module
  if (duration <= 1) {
    return Promise.resolve();
  }

  const newMod = {
    module_id,
    group_id,
    duration: Math.floor(duration / 2),
    notes,
  };

  let updatedMods = [...existingMods];
  updatedMods[position].duration -= newMod.duration;
  existingMods.splice(position + 1, 0, newMod);
  updatedMods = resequenceModules(updatedMods);

  return bulkUpdateRunningsModules(con, existingMods, updatedMods, groupId);
}

async function updateNotes(con, runningId, notes) {
  const sql = 'UPDATE running_modules SET notes=? WHERE id=?';
  return execQuery(con, sql, [notes, runningId]);
}

module.exports = {
  getRunningModuleById,
  getRunningModules,
  addRunningModule,
  updateRunningModule,
  deleteRunningModule,
  splitRunningModule,
  updateNotes,
};
