const getConnection = require('./connection').getConnection
const db = require('../datalayer/states')

function getStudentsState(req, res) {
  getConnection(req, res)
    .then(con => db.getStudentsState(con, req.params.groupId))
    .then(result => res.status(result.affectedRows > 0 ? 200 : 404).json(result))
}

function updateUser(req, res, next) {
  const user = req.body
  const userListToUpdate = {
    id: user.id,
    username: user.username,
    full_name: user.full_name,
    role: user.role,
    slack_username: user.slack_username,
    freecodecamp_username: user.freecodecamp_username,
    email: user.email,
    mobile: user.mobile
  }
  getConnection(req, res)
    .then(con => db.updateUser(con, userListToUpdate))
    .then(result => {
      if (result.affectedRows > 0) {
        if (req.body.group_id) return next()
        res.status(200)
      } else {
        res.status(404)
      }
    })
    .then(() => res.status(200))
}

function assignToClass(req, res) {
  const userAndGroupIds = [req.body.group_id, req.body.id]
  getConnection(req, res)
    .then(con => db.assignToClass(con, userAndGroupIds))
    .then(result => res.status(result.affectedRows > 0 ? 200 : 404))
    .catch(err => res.status(400).json(err))
}

module.exports = {
  getStudentsState,
  updateUser,
  assignToClass
}
