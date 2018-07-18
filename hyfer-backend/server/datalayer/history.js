const { execQuery } = require('./database');

const GET_STUDENTS_BY_RUNNING_MODULE_ID = `
    SELECT group_id, running_module_id, user_id, DATE_FORMAT(date, "%Y/%m/%d") as date, attendance, homework, username, full_name
    FROM students_history sh 
    JOIN users u ON sh.user_id=u.id WHERE running_module_id=?
`;
const SAVE_ATTENDANCES = `
    REPLACE INTO students_history (running_module_id, user_id,week_num,date,attendance,homework) VALUES ?
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
  const { running_module_id,
    user_id,
    week_num,
    attendance,
    homework } = list
  return execQuery(con, `
  REPLACE INTO students_history (running_module_id, user_id,week_num,attendance,homework) VALUES (?,?,?,?,?)
`, [running_module_id, user_id, week_num, attendance, homework]);
}

module.exports = {
  getStudentHistory,
  getHistory,
  saveHistory,
};
