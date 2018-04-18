const db = require('./database')

const GET_STUDENTS_BY_RUNNING_MODULE_ID = `
    SELECT group_id, running_module_id, user_id, DATE_FORMAT(date, "%Y/%m/%d") as date, attendance, homework, username, full_name
    FROM students_history sh 
    JOIN users u ON sh.user_id=u.id WHERE running_module_id=?
`
const SAVE_ATTENDANCES = `
    REPLACE INTO students_history (date, group_id, running_module_id, user_id, attendance, homework) VALUES ?
`

function getHistory (con, running_module_id) {
  return db.execQuery(con, GET_STUDENTS_BY_RUNNING_MODULE_ID, [running_module_id])
}

function saveHistory (con, list) {
  return db.execQuery(con, SAVE_ATTENDANCES, [list])
}

module.exports = {
  getHistory,
  saveHistory
}
