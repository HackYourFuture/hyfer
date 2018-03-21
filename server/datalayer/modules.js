'use strict'
const db = require('./database')

const GET_MODULE_QUERY =
  `SELECT id, module_name, display_name, added_on, default_duration, git_url, git_owner, git_repo, color, optional,
        (SELECT COUNT(*) FROM running_modules WHERE running_modules.module_id = modules.id) AS ref_count
        FROM modules`
const ADD_MODULE_QUERY = `INSERT INTO modules SET ?`
const UPDATE_MODULE_QUERY = `UPDATE modules SET ? WHERE id = ?`
const DELETE_MODULE_QUERY = `DELETE FROM modules WHERE id = ?`

function getModule(con, id) {
  const sql = GET_MODULE_QUERY + ` WHERE id=?`
  return db.execQuery(con, sql, [id])
}

function getModules(con) {
  const sql = GET_MODULE_QUERY + ` ORDER BY sort_order, module_name`
  return db.execQuery(con, sql)
}

function getCurriculumModules(con) {
  const sql = GET_MODULE_QUERY + ` WHERE optional=0 ORDER BY sort_order`
  return db.execQuery(con, sql)
}

function getOptionalModules(con) {
  const sql = GET_MODULE_QUERY + ` WHERE optional!=0 ORDER BY module_name`
  return db.execQuery(con, sql)
}

function addModule(con, module) {
  delete module.id
  delete module.added_on
  delete module.ref_count
  return db.execQuery(con, ADD_MODULE_QUERY, module)
}

function updateModule(con, module, id) {
  delete module.id
  delete module.added_on
  delete module.ref_count
  return db.execQuery(con, UPDATE_MODULE_QUERY, [module, id])
}

function deleteModule(con, id) {
  return db.execQuery(con, DELETE_MODULE_QUERY, [id])
}

function updateModules(con, batchUpdate) {
  return new Promise((resolve, reject) => {
    con.beginTransaction(err => {
      if (err) {
        return reject(err)
      }
      const promises = batchUpdate.updates.map(module => this.updateModule(con, module, module.id))
        .concat(batchUpdate.additions.map(module => this.addModule(con, module)))
        .concat(batchUpdate.deletions.map(module => this.deleteModule(con, module.id)))
      Promise.all(promises)
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
}

module.exports = {
  getModule,
  getModules,
  getCurriculumModules,
  getOptionalModules,
  addModule,
  updateModule,
  deleteModule,
  updateModules
}
