const mysql = require('mysql');
const util = require('util');
const log = require('../util/logger');

const {
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DATABASE,
} = process.env;

const config = {
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DATABASE,
};

const connection = mysql.createConnection(config);

function getConnection() {
  return Promise.resolve(connection);
}

function execQuery(con, sql, args = []) {
  if (process.env.DB_DEBUG === '1') {
    log.debug('---------');
    log.debug('SQL  =>', sql.trim());
    log.debug('args =>', util.inspect(args));
  }
  return new Promise((resolve, reject) => {
    con.query(sql, args, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

function beginTransaction(con) {
  return new Promise((resolve, reject) => {
    con.beginTransaction((err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

function commit(con) {
  return new Promise((resolve, reject) => {
    con.commit((err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

function rollback(con) {
  return new Promise((resolve, reject) => {
    con.rollback((err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}


module.exports = {
  getConnection,
  execQuery,
  beginTransaction,
  commit,
  rollback,
};
