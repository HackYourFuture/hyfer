'use strict'
const db = require('./database')
const modules = require('./modules')

const GET_TIME_LINE_QUERY =
  `SELECT groups.id,
        groups.group_name,
        groups.starting_date,
        running_modules.duration,
        running_modules.id AS running_module_id,
        running_modules.position,
        modules.module_name,
        modules.display_name,
        modules.color,
        modules.git_url,
        modules.git_repo,
        modules.optional
    FROM groups
    INNER JOIN running_modules ON running_modules.group_id = groups.id
    INNER JOIN modules ON running_modules.module_id = modules.id
    WHERE groups.archived=0
    ORDER BY groups.starting_date, running_modules.position`

const ADD_GROUP_QUERY = `INSERT INTO groups SET ?`
const UPDATE_GROUP_QUERY = `UPDATE groups SET ? WHERE id = ?`
const DELETE_GROUP_QUERY = `DELETE FROM groups WHERE id = ?`

const ADD_RUNNING_MODULES_QUERY =
  `INSERT INTO running_modules (description, module_id, group_id, duration, position) VALUES`

function getTimeline(con) {
  return db.execQuery(con, GET_TIME_LINE_QUERY)
}

function getGroups(con) {
  return db.execQuery(con, 'SELECT id, group_name, starting_date FROM groups ORDER BY starting_date')
}

function updateGroup(con, module, id) {
  return db.execQuery(con, UPDATE_GROUP_QUERY, [module, id])
}

function deleteGroup(con, id) {
  return db.execQuery(con, DELETE_GROUP_QUERY, [id])
}

function addGroup(con, group) {
  const data = {
    group_name: group.group_name,
    starting_date: new Date(group.starting_date)
  }

  return new Promise((resolve, reject) => {
    con.beginTransaction(err => {
      if (err) {
        return reject(err)
      }
    })
    db.execQuery(con, ADD_GROUP_QUERY, data)
      .then(result => {
        const groupId = result.insertId
        return modules.getCurriculumModules(con)
          .then(mods => {
            const runningModules = makeRunningModules(groupId, mods)
            const valueList = makeValueList(runningModules)
            const sql = ADD_RUNNING_MODULES_QUERY + valueList
            return db.execQuery(con, sql)
          })
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
}

function makeRunningModules(groupId, mods) {
  return mods.map((module, position) => ({
    description: module.description,
    module_id: module.id,
    group_id: groupId,
    duration: module.default_duration,
    position: position
  }))
}

function makeValueList(runningModules) {
  return runningModules.reduce((str, mod) => {
    if (str.length > 0) {
      str += ','
    }
    return str + `('${mod.description}',${mod.module_id},${mod.group_id},${mod.duration},${mod.position})`
  }, '')
}

module.exports = {
  getTimeline,
  getGroups,
  addGroup,
  updateGroup,
  deleteGroup
}
