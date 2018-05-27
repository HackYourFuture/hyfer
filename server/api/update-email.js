const { getConnection } = require('./connection')
const { execQuery } = require('../datalayer/database')

const setEmail = (req, res) => {
    getConnection(req, res).then(con => {
        execQuery(con, `UPDATE users SET email = (?) WHERE username = (?);`, [req.body.email, req.body.username]).then(rows => {
            res.send(req.body)
        }).catch(console.log)
    }).catch(console.log)
}

module.exports = {
    setEmail
}