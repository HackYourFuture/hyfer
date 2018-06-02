const winston = require('winston');

winston.level = process.env.LOG_LEVEL || 'debug';

module.exports = {
  info: (...args) => winston.info(...args),
  log: (...args) => winston.log(...args),
  error: (...args) => winston.error(...args),
  debug: (...args) => winston.debug(...args),
};
