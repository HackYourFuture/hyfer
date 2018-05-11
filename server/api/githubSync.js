'use strict'
const db = require('../datalayer/githubSync')
const {getConnection} = require('./connection')

function githubSync(req, res) {
    getConnection(req, res)
        .then(con => db.githubSync(con, req.body))
        .then(res.end())
        .catch(err => {
            console.log(err)
            res.sendStatus(500)
        })
}

module.exports = {
    githubSync
}