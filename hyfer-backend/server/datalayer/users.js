const {
  execQuery,
  beginTransaction,
  commit,
  rollback,
} = require('./database');

const GET_USERS_QUERY = `
  SELECT users.*, \`groups\`.group_name 
  FROM users
  LEFT JOIN group_students ON users.id=group_students.user_id      
  LEFT JOIN \`groups\` ON \`groups\`.id=group_students.group_id`;

const UPDATE_USER_QUERY = `
  UPDATE users SET full_name=?, role=?, email=?, mobile=?
  WHERE id=?`;

const USERS_MODULE_STUDENTS = `SELECT users.id , users.full_name, users.role, users.username,
 groups.starting_date,groups.group_name from users
 LEFT JOIN group_students ON users.id=group_students.user_id 
 LEFT JOIN groups ON groups.id = group_students.group_id  
`;

function getUsersModulesInfo(con, group_name) {
  return execQuery(con, `${USERS_MODULE_STUDENTS} WHERE groups.group_name=?`, group_name);
}

function getTeachers(con, id) {
  return execQuery(con, `SELECT *
  FROM users
  WHERE users.id IN
  (
    SELECT teacher1_id FROM running_modules
    WHERE running_modules.id= ${id}
    UNION
    SELECT teacher2_id FROM running_modules
    WHERE running_modules.id= ${id}
  )`);
}

function getUsers(con) {
  return execQuery(con, `${GET_USERS_QUERY} ORDER BY full_name`);
}

function getUserProfile(con, username) {
  return execQuery(con, 'SELECT username, full_name, role FROM users WHERE username=?', username);
}

function getUserByUsername(con, username) {
  return execQuery(con, `${GET_USERS_QUERY} WHERE username=?`, username);
}

function getUserById(con, id) {
  return execQuery(con, `${GET_USERS_QUERY} WHERE users.id=?`, id);
}

function getUsersByGroup(con, groupId) {
  return execQuery(con, `${GET_USERS_QUERY} WHERE \`groups\`.id=?`, groupId);
}

function getTeachersByRunningModule(con, runningId) {
  const sql = `SELECT users.*
    FROM users
    INNER JOIN running_module_teachers ON running_module_teachers.user_id = users.id
    WHERE running_module_teachers.running_module_id=?`;
  return execQuery(con, sql, [runningId]);
}

async function addUser(con, user) {
  const { insertId } = await execQuery(
    con,
    'INSERT INTO users (username, access_token, full_name, email, role) VALUES(?,?,?,?,?)',
    [user.username, user.access_token, user.full_name, user.email, user.role]
  );
  return insertId;
}

function bulkInsertUsers(con, users) {
  const args = users.map(user => [user.username, user.full_name, user.email, user.role]);
  return execQuery(
    con,
    'INSERT INTO users (username, full_name, email, role) VALUES ?',
    [args]
  );
}

function bulkUpdateUsers(con, users) {
  const promises = users.map(user => execQuery(
    con,
    'UPDATE users SET full_name=?, email=?, role=? WHERE username=?',
    [user.full_name, user.email, user.role, user.username]
  ));
  return Promise.all(promises);
}

async function bulkUpdateMemberships(con, groupAndUserIds) {
  await execQuery(con, 'DELETE FROM group_students');
  return execQuery(con, 'INSERT INTO group_students (group_id, user_id) VALUES ?', [groupAndUserIds]);
}

async function updateUser(con, id, user) {
  try {
    await beginTransaction(con);
    await execQuery(con, UPDATE_USER_QUERY, [
      user.full_name,
      user.role,
      user.linkedin_username,
      user.email,
      user.mobile,
      id,
    ]);
    await execQuery(con, 'DELETE FROM group_students WHERE user_id=?', [id]);
    if (user.group_id) {
      await execQuery(
        con,
        'INSERT INTO group_students (user_id, group_id) VALUES(?,?)',
        [id, user.group_id]
      );
    }
    await commit(con);
  } catch (err) {
    await rollback(con);
    throw err;
  }
}

module.exports = {
  getUsers,
  getUserProfile,
  getUserByUsername,
  getUsersByGroup,
  getTeachersByRunningModule,
  getUserById,
  addUser,
  updateUser,
  bulkInsertUsers,
  bulkUpdateUsers,
  bulkUpdateMemberships,
  getUsersModulesInfo,
  getTeachers,
};
