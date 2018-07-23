const db = require('../datalayer/githubSync');
const { getConnection } = require('./connection');
const logger = require('../util/logger');

async function githubSync(req, res) {
  try {
    const { username } = req.params;
    const syncAll = 'all' in req.query;
    const con = await getConnection(req, res);
    await db.githubSync(con, username, syncAll);
    res.sendStatus(204);
    logger.info('GitHub sync', { requester: req.user.username });
  } catch (err) {
    logger.error(err, { requester: req.user.username });
    res.sendStatus(500);
  }
}


module.exports = {
  githubSync,
};
