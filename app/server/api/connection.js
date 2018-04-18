'use strict'

function getConnection(req, res) {
  return new Promise((resolve, reject) => {
    req.getConnection((err, con) => {
      if (err) {
        res.sendStatus(500)
        reject(err)
      } else {
        resolve(con)
      }
    })
  })
}

module.exports = {
  getConnection
}
