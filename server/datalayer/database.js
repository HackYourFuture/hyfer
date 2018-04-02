'use strict'
// const util = require('util')

// const development = process.env.NODE_ENV === 'development'

function execQuery(con, sql, args = []) {
  // if (development) {
  //   console.log(sql)
  //   console.log(util.inspect(args))
  // }
  return new Promise((resolve, reject) => {
    con.query(sql, args, (err, rows) => {
      if (err) {
        reject(err)
      } else {
        resolve(rows)
      }
    })
  })
}

module.exports = {
  execQuery
}
