const log = require('../util/logger');

module.exports = label => (req, res, err) => {
  log.error(label, { err, requester: req.user.username });
  res.status(500).json(err);
};
