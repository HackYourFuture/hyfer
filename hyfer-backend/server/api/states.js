const { getConnection } = require('./connection');
const db = require('../datalayer/states');

function getStudentsState(req, res) {
  getConnection(req, res)
    .then(con => db.getStudentsState(con, req.params.groupId))
    .then(result => res.status(result.affectedRows > 0 ? 200 : 404).json(result));
}

async function updateUser(req, res) {
  const {
    id,
    username,
    full_name,
    role,
    email,
    mobile,
  } = req.body;
  const userListToUpdate = {
    id,
    username,
    full_name,
    role,
    email,
    mobile,
  };

  try {
    const con = await getConnection(req, res);
    const result = await db.updateUser(con, userListToUpdate);
    res.sendStatus(result.affectedRows > 0 ? 200 : 404);
  } catch (err) {
    res.status(500).json(err);
  }
}

function assignToClass(req, res) {
  const userAndGroupIds = [req.body.group_id, req.body.id];
  getConnection(req, res)
    .then(con => db.assignToClass(con, userAndGroupIds))
    .then(result => res.status(result.affectedRows > 0 ? 200 : 404))
    .catch(err => res.status(400).json(err));
}

module.exports = {
  getStudentsState,
  updateUser,
  assignToClass,
};
