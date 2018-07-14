const { execQuery } = require('./database');

const GET_USERS = `
  SELECT users.*, \`groups\`.group_name 
  FROM users
  LEFT JOIN group_students ON users.id=group_students.user_id      
  LEFT JOIN \`groups\` ON \`groups\`.id=group_students.group_id`;

const UPDATE_USER =
  'UPDATE users SET email=?, linkedin_username=? WHERE id=?';

const USERS_MODULE_STUDENTS = `
  SELECT users.id , users.full_name, users.role, users.username,
    groups.starting_date,groups.group_name from users
    LEFT JOIN group_students ON users.id=group_students.user_id 
    LEFT JOIN groups ON groups.id = group_students.group_id`;

function getTeachers(con) {
  return execQuery(con, `SELECT * FROM users WHERE 
    users.role='teacher' ORDER BY full_name ASC`);
}

function getUsersModulesInfo(con, groupName) {
  return execQuery(con, `${USERS_MODULE_STUDENTS} WHERE groups.group_name=?`, groupName);
}

function getUsers(con) {
  return execQuery(con, `${GET_USERS} ORDER BY full_name`);
}

function getUserByUsername(con, username) {
  return execQuery(con, 'SELECT * FROM users WHERE username=?', username);
}

function getUserById(con, id) {
  return execQuery(con, 'SELECT * FROM users WHERE users.id=?', id);
}

function getUsersByGroup(con, groupId) {
  return execQuery(con, `${GET_USERS} WHERE \`groups\`.id=?`, groupId);
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
    'INSERT INTO users (username, full_name, email, role) VALUES(?,?,?,?)',
    [user.username, user.full_name, user.email, user.role]
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

function updateUser(con, id, data) {
  const { email, linkedInName } = data;
  return execQuery(con, UPDATE_USER, [email, linkedInName, id]);
}

module.exports = {
  getUsers,
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
