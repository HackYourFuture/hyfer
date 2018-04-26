'use strict'
const httpRequest = require('request')
const marked = require('marked')
const LRU = require('lru-cache')
const config = require('../config/config')

const API_END_POINT = 'https://api.github.com/repos'
const ONE_DAY_IN_MSECS = 24 * 60 * 60 * 1000

const cache = LRU({
    max: 100,
    maxAge: ONE_DAY_IN_MSECS
})

function httpRequestPromise(url) {
    return new Promise((resolve, reject) => {
        const request = { 
            url,
            json: true,
            headers: {
                'User-Agent': 'hackyourfuture',
                'Authorization': 'token ' + config.githubTeamKey
            }
        }
        httpRequest.get(request, (error, response, body) => {
            //console.log(response.body)
            if (error) {
                reject(error)
                return
            }
            resolve(response.body)
            //console.log(response.body)
        })
    })
}

async function getTeams(req, res) {
    const result = []
    const teams = await httpRequestPromise(`https://api.github.com/orgs/hackyourfuture/teams`)
    console.log(teams)
    teams.forEach(async team => {
        const teamInfo = {
            teamName: team.name,
            id: team.id,
            url: team.url,
            members:{}
        }
        result.push(teamInfo)
    })
    res.send(result)
}


async function getTeamMembers(req, res) {
    
    const teamMembers = await httpRequestPromise(`https://api.github.com/teams/${req.params.id}/members`)
    console.log(teamMembers);
    const promises = teamMembers.map(member => httpRequestPromise(member.url))
    const members = await Promise.all(promises)
    const memberInfo = members.map(member => {
        return {
            login: member.login,
            name: member.name,
            email: member.email
        }
    })
    res.send(memberInfo)
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
                url: `${API_END_POINT}/${ownerAndRepo}/readme`,
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
    getTeamMembers
}
