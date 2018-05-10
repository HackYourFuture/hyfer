'use strict'
const db = require('./database')
const groups = require('./groups')
const users = require('./users')

async function githubSync(con, teams) {
    const promises = teams.map(team => {
        const isClass = /class/i.test(team.teamName)
        const isTeacher = /teacher/i.test(team.teamName)

        let role = 'guest'
        if (isClass) {
            role = 'student'
        } else if (isTeacher) {
            role = 'teacher'
        }

        let teamName = team.teamName
        if (isClass) {
            let classNumber = team.teamName.match(/\d+/g)
            teamName = `Class ${Number(classNumber)}`
        }
        const group = {
            group_name: teamName,
            starting_date: new Date(team.created_at),
            archived: isClass ? 0 : 1
        }
        return groups.addGroup(con, group)
            .then(groupId => {
                return addUsers(con, team.members, role, groupId)
            })
    })
    await Promise.all(promises)
}

function addUsers(con, members, role, groupId) {
    const promises = members.map(member => {
        const user = {
            username: member.login,
            full_name: member.name || member.login,
            email: member.email,
            access_token: null,
            role
        }
        return users.addUser(con, user)
            .then(userId => {
                if (role === 'student') {
                    return db.execQuery(con, `INSERT INTO group_students (user_id, group_id) VALUES(?,?)`, [userId, groupId])
                }
            })
    })

    return Promise.all(promises)
}

module.exports = {
    githubSync
}