const mysql = require('mysql');
const connection = require('express-myconnection');
const log = require('../util/logger');

const {
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DATABASE,
} = process.env;

const connectionConfig = {
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DATABASE,
};

module.exports = (app) => {
  app.use(connection(mysql, connectionConfig, 'pool'));
  log.info(`Connected to database ${DATABASE}`);
};
