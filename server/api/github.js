'use strict'
const httpRequest = require('request')
const marked = require('marked')
const LRU = require('lru-cache')
const config = require("../config/config")

const API_END_POINT = 'https://api.github.com'
const ONE_DAY_IN_MSECS = 24 * 60 * 60 * 1000

const cache = LRU({
    max: 100,
    maxAge: ONE_DAY_IN_MSECS
})


function getTeams(req, res) {
    const allTeams = []
    function fetchTeams() {
        return new Promise((resolve, reject) => {
            const request = {
                url: `${API_END_POINT}/orgs/hackyourfuture/teams`,
                json: true,
                headers: {
                    'User-Agent': 'hackyourfuture',
                    'Authorization': 'token ' + config.githubToken
                }
            }
            httpRequest.get(request, (error, response, body) => {
                if (!error && response.statusCode === 200) {
                    resolve(response.body)
                    res.send(response.body)
                } else {
                    reject(error)
                }
            })
        })
    } 
    fetchTeams()
        .then(fetchedTeams => fetchedTeams.map(team => {
            if (team.name.slice(0, 5) === "class") {
                allTeams.push({ teamName: team.name, teamId: team.id })
            }
        }))
        .then(() => allTeams)
        .catch(err => {
            console.log(err)
            throw new Error("failed to fetch teams names")
        })
}

function getTeamMembers(req, res) {
    const teamId = req.params.id
    const teamMembers = []

    function fetchMembers() {
        return new Promise((resolve, reject) => {
            const request = {
                url: `${API_END_POINT}/teams/${teamId}/members`,
                json: true,
                headers: {
                    'User-Agent': 'hackyourfuture',
                    'Authorization': 'token ' + config.githubToken
                }
            }
            httpRequest.get(request, (error, response, body) => {
                if (!error && response.statusCode === 200) {
                    resolve(response.body)
                    res.send(response.body)
                } else {
                    reject(error)
                }
            })
        })
    }
    fetchMembers()
        .then(fetchedTeam => fetchedTeam.map(member => {
            teamMembers.push({
                memberLogin: member.login,
                memberId: member.id,
                memberAvatar: member.avatar_url
            })

        }))
        .then(() => teamMembers)
        .catch(err => {
            console.log(err)
            throw new Error("failed to fetch teams members")
        })
}

function getUserEmails(req, res) {

    function fetchEmails() {
        return new Promise((resolve, reject) => {
            const request = {
                url: `${API_END_POINT}/user/emails`,
                json: true,
                headers: {
                    'User-Agent': 'hackyourfuture',
                    'Authorization': 'token ' + config.githubToken
                }
            }
            httpRequest.get(request, (error, response, body) => {
                if (!error && response.statusCode === 200) {
                    resolve(response.body)
                    res.send(response.body)
                } else {
                    reject(error)
                }
            })
        })
    }
    fetchEmails()
    .then(userEmails => {
        return userEmails[0].email
        })
        .catch(err => {
            console.log(err)
            throw new Error("failed to fetch user's emails")
        })
}


function getReadMeAsHtml(req, res) {
    const owner = req.params.owner
    const repo = req.params.repo
    const ownerAndRepo = `${owner}/${repo}`

    let promise
    const html = cache.get(ownerAndRepo)
    if (html) {
        console.log('README cache hit for: ' + ownerAndRepo)
        promise = Promise.resolve(html)
    } else {
        console.log('README cache miss for: ' + ownerAndRepo)
        promise = new Promise((resolve, reject) => {
            const request = {
                url: `${API_END_POINT}/repos/${ownerAndRepo}/readme`,
                json: true,
                headers: {
                    'User-Agent': 'hackyourfuture'
                }
            }
            httpRequest.get(request, (error, response, body) => {
                if (!error && response.statusCode === 200) {
                    console.log('README received from GitHub')
                    const md = Buffer.from(body.content, 'base64').toString()
                    const html = marked(md, {
                        breaks: true,
                        smartypants: true
                    })
                    cache.set(ownerAndRepo, html)
                    resolve(html)
                } else {
                    reject(error)
                }
            })
        })
    }

    promise.then(html => res.send(html))
        .catch(() => res.sendStatus(404))
}

module.exports = {
    getReadMeAsHtml,
    getTeams,
    getTeamMembers,
    getUserEmails
}
