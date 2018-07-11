const { execQuery } = require('./database');

const GET_STUDENTS_BY_RUNNING_MODULE_ID = `
    SELECT group_id, running_module_id, user_id, DATE_FORMAT(date, "%Y/%m/%d") as date, attendance, homework, username, full_name
    FROM students_history sh 
    JOIN users u ON sh.user_id=u.id WHERE running_module_id=?
`;
const SAVE_ATTENDANCES = `
    REPLACE INTO students_history (date, group_id, running_module_id, user_id, attendance, homework) VALUES ?
`;

function getStudentHistory(con, runningId, userId) {
  const sql = `
    SELECT week_num, date, attendance, homework
    FROM students_history
    WHERE running_module_id=? AND user_id=?`;
  return execQuery(con, sql, [runningId, userId]);
}


function getHistory(con, runningModuleId) {
  return execQuery(con, GET_STUDENTS_BY_RUNNING_MODULE_ID, [
    runningModuleId,
  ]);
}

function saveHistory(con, list) {
  return execQuery(con, SAVE_ATTENDANCES, [list]);
}

module.exports = {
  getStudentHistory,
  getHistory,
  saveHistory,
};
