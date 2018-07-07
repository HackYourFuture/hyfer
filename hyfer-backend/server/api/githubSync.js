const db = require('../datalayer/githubSync');
const { getConnection } = require('./connection');
const logger = require('../util/logger');

function githubSync(req, res) {
  getConnection(req, res)
    .then(con => db.githubSync(con))
    .then(res.end())
    .catch((err) => {
      logger.log(err);
      res.sendStatus(500);
    });
}

module.exports = {
  githubSync,
};
