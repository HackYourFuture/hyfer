const log = require('../util/logger');

module.exports = label => (err, res) => {
  log.error(`${label}: ${err}`);
  res.status(500).json(err);
};
