'use strict'
const mysql = require('mysql')
const connection = require('express-myconnection')
const config = require('../config/config.js')

module.exports = function (app) {
  app.use(connection(mysql, {
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database
  }, 'pool')) // or single
  console.log('Connected to ' + config.database)
}
