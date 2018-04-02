'use strict'
const db = require('./database')
const modules = require('./modules')

const GET_RUNNING_MODULES_QUERY = `SELECT duration, teacher1_id, teacher2_id FROM running_modules`
const GET_ALL_FROM_RUNNING_MODULES_QUERY = `SELECT * FROM running_modules`
const DELETE_ALL_RUNNING_MODULES_QUERY = `DELETE FROM running_modules WHERE group_id=?`
const INSERT_RUNNING_MODULES_QUERY =
  `INSERT INTO running_modules (module_id, group_id, duration, position, teacher1_id, teacher2_id) VALUES ?`

function getRunningModules(con, groupId) {
  const sql = GET_RUNNING_MODULES_QUERY + ` WHERE group_id=? ORDER BY position`
  return db.execQuery(con, sql, [groupId])
}

function getAllFromRunningModules(con, groupId) {
  const sql = GET_ALL_FROM_RUNNING_MODULES_QUERY + ` WHERE group_id=? ORDER BY position`
  return db.execQuery(con, sql, [groupId])
}

function addModuleToRunningModules(con, moduleId, groupId, position) {
  return modules.getModule(con, moduleId)
    .then(rows => {
      const module = rows[0]
      const newMod = {
        description: module.description,
        module_id: moduleId,
        group_id: groupId,
        duration: module.default_duration,
        teacher1_id: null,
        teacher2_id: null
      }
      return getAllFromRunningModules(con, groupId)
        .then(runningMods => {
          insertRunningModuleAtIndex(runningMods, newMod, position)
          resequenceRunningModules(runningMods)
          return replaceRunningModules(con, runningMods, groupId)
        })
    })
}

function updateRunningModule(con, updates, groupId, position) {
  return getAllFromRunningModules(con, groupId)
    .then(runningMods => {
      const targetMod = runningMods[position]
      runningMods.splice(position, 1)
      Object.assign(targetMod, updates)
      insertRunningModuleAtIndex(runningMods, targetMod, updates.position || position)
      resequenceRunningModules(runningMods)
      return replaceRunningModules(con, runningMods, groupId)
    })
}

function deleteRunningModule(con, groupId, position) {
  return getAllFromRunningModules(con, groupId)
    .then(runningMods => {
      runningMods = runningMods.filter(mod => mod.position !== position)
      resequenceRunningModules(runningMods)
      return replaceRunningModules(con, runningMods, groupId)
    })
}

function splitRunningModule(con, groupId, position) {
  return getAllFromRunningModules(con, groupId)
    .then(runningMods => {
      const newMod = Object.assign({}, runningMods[position])
      if (newMod.duration === 1) {
        return Promise.resolve()
      }
      newMod.duration = Math.floor(newMod.duration / 2)
      runningMods[position].duration = runningMods[position].duration - newMod.duration
      runningMods.splice(position, 0, newMod)
      resequenceRunningModules(runningMods)
      return replaceRunningModules(con, runningMods, groupId)
    })
}

function replaceRunningModules(con, runningMods, groupId) {
  return new Promise((resolve, reject) => {
    con.beginTransaction(err => {
      if (err) {
        return reject(err)
      }
      db.execQuery(con, DELETE_ALL_RUNNING_MODULES_QUERY, groupId)
        .then(() => {
          const values = makeValueList(runningMods)
          return db.execQuery(con, INSERT_RUNNING_MODULES_QUERY, [values])
        })
        .then(() => {
          con.commit(err => {
            if (err) {
              throw err
            }
            resolve()
          })
        })
        .catch(err => {
          con.rollback(() => {
            reject(err)
          })
        })
    })
  })
    .then(() => getAllFromRunningModules(con, groupId))
}

function insertRunningModuleAtIndex(runningMods, targetMod, position) {
  if (position >= 0 && position <= runningMods.length) {
    runningMods.splice(position, 0, targetMod)
  } else {
    runningMods.push(targetMod)
  }
}

function resequenceRunningModules(runningMods) {
  runningMods.forEach((runningModule, position) => {
    runningModule.position = position
  })
}

function makeValueList(runningModules) {
  return runningModules.reduce((values, mod) => {
    values.push([mod.module_id, mod.group_id, mod.duration, mod.position, mod.teacher1_id, mod.teacher2_id])
    return values
  }, [])
}

module.exports = {
  getRunningModules,
  addModuleToRunningModules,
  updateRunningModule,
  deleteRunningModule,
  splitRunningModule
}
