const { execQuery } = require('./database');

function getHistory(con, runningId, userId) {
  const sql = `
    SELECT *
    FROM students_history
    WHERE running_module_id=? AND user_id=?`;
  return execQuery(con, sql, [runningId, userId]);
}

async function saveHistory(con, data) {
  const sql = `
    REPLACE INTO students_history
      (running_module_id, user_id, week_num, attendance, homework) 
      VALUES (?,?,?,?,?)`;

  const {
    runningId,
    userId,
    weekNum,
    attendance,
    homework,
  } = data;
  await execQuery(con, sql, [
    runningId,
    userId,
    weekNum,
    attendance,
    homework,
  ]);
  return getHistory(con, runningId, userId);
}

module.exports = {
  getHistory,
  saveHistory,
};
