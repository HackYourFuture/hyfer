'use strict'
const db = require('./database')

const GET_USERS_QUERY =
  `SELECT users.id, users.username, users.full_name, users.role, users.register_date,
  users.slack_username, users.freecodecamp_username, users.email, users.mobile,
  group_students.group_id, groups.group_name FROM users
  LEFT JOIN group_students ON users.id=group_students.user_id
  LEFT JOIN groups ON groups.id=group_students.group_id`

const UPDATE_USER_QUERY =
  `UPDATE users SET full_name=?, role=?, slack_username=?, freecodecamp_username=?, email=?, mobile=? WHERE id=?`

function getUsers(con) {
  return db.execQuery(con, GET_USERS_QUERY + ' ORDER BY full_name')
}

function getUserByUsername(con, username) {
  return db.execQuery(con, GET_USERS_QUERY + ' WHERE username=?', username)
}

function getUserById(con, id) {
  return db.execQuery(con, GET_USERS_QUERY + ' WHERE users.id=?', id)
}

function addUser(con, user) {
  return db.execQuery(con, `INSERT INTO users (username, access_token, full_name, email, role) VALUES(?,?,?,?,?)`,
    [user.username, user.access_token, user.full_name, user.email, user.role])
}

function updateUser(con, id, user) {
  return new Promise((resolve, reject) => {
    con.beginTransaction(err => {
      if (err) {
        return reject(err)
      }
      db.execQuery(con, UPDATE_USER_QUERY, [user.full_name, user.role, user.slack_username, user.freecodecamp_username, user.email, user.mobile, id])
        .then(() => db.execQuery(con, `DELETE FROM group_students WHERE user_id=?`, [id]))
        .then(() => {
          if (user.group_id) {
            return db.execQuery(con, `INSERT INTO group_students (user_id, group_id) VALUES(?,?)`, [id, user.group_id])
          } else {
            return Promise.resolve()
          }
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
}

module.exports = {
  getUsers,
  getUserByUsername,
  getUserById,
  addUser,
  updateUser
}
