const db = require('./database')
const GET_CURRENT_STATE = `
  SELECT group_id, user_id, u.full_name, u.username, DATE_FORMAT(g.starting_date, "%Y-%m-%d") as date, g.group_name FROM group_students 
  JOIN users u ON user_id = u.id
  JOIN groups g ON group_id = g.id 
  WHERE group_id=?
`

const UPDATE_USER = `
  UPDATE users SET ? WHERE id = ?
 `
const ASSIGN_USER_TO_CLASS = `
  REPLACE INTO group_students VALUES ?
`

function getStudentsState (con, groupId) {
  return db.execQuery(con, GET_CURRENT_STATE, groupId)
}

function updateUser (con, user) {
  return db.execQuery(con, UPDATE_USER, [user, user.id])
}

function assignToClass (con, userAndGroupIds) {
  console.log(userAndGroupIds)
  return db.execQuery(con, ASSIGN_USER_TO_CLASS, [[userAndGroupIds]])
}

module.exports = {
  getStudentsState,
  updateUser,
  assignToClass
}
