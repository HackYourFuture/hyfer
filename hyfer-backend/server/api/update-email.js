const { getConnection } = require('./connection');
const { execQuery } = require('../datalayer/database');

async function setEmail(req, res) {
  try {
    const con = await getConnection(req, res);
    await execQuery(con, 'UPDATE users SET email = (?) WHERE id = (?);', [
      req.body.email,
      req.body.id,
    ]);
    res.send(req.body);
  } catch (err) {
    res.status(500).json(err);
  }
}

module.exports = {
  setEmail,
};
