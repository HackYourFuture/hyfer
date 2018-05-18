'use strict'
const passport = require('passport')
require('./auth/github-auth')
const auth = require('./auth/auth-service')
const github = require('./api/github')
const users = require('./api/users')
const githubSync = require('./api/githubSync')
const sendGrid = require('./api/sendGrid')

const modules = require('./api/modules')
const runningModules = require('./api/running-modules')
const groups = require('./api/groups')
const history = require('./api/history')
const states = require('./api/states')
const homework = require('./api/homework')
const {setEmail} = require('./api/update-email')

module.exports = function (app) {
    app.get('/api/modules', auth.hasRole('teacher|student'), modules.getModules)
    app.get('/api/modules/homework', auth.hasRole('teacher|student'), modules.getHomeworkModules)
    app.post('/api/modules', auth.hasRole('teacher|student'), modules.addModule)
    app.patch('/api/modules', auth.hasRole('teacher'), modules.updateModules)
    app.patch('/api/modules/:id', auth.hasRole('teacher'), modules.updateModule)
    app.delete('/api/modules/:id', auth.hasRole('teacher'), modules.deleteModule)

    app.get('/api/running/:groupId', auth.hasRole('teacher'), runningModules.getRunningModules)

    app.patch('/api/running/update/:groupId/:position', auth.hasRole('teacher'), runningModules.updateRunningModule)
    app.patch('/api/running/split/:groupId/:position', auth.hasRole('teacher'), runningModules.splitRunningModule)
    app.patch('/api/running/add/:moduleId/:groupId/:position', auth.hasRole('teacher'), runningModules.addModuleToRunningModules)
    app.delete('/api/running/:groupId/:position', auth.hasRole('teacher'), runningModules.deleteRunningModule)

    app.get('/api/timeline', groups.getTimeline)

    app.get('/api/groups', groups.getGroups)
    //app.get('/api/groups', auth.isAuthenticated(), groups.getGroups)
    app.post('/api/groups', auth.hasRole('teacher'), groups.addGroup)
    app.patch('/api/groups/:id', auth.hasRole('teacher'), groups.updateGroup)
    app.delete('/api/groups/:id', auth.hasRole('teacher'), groups.deleteGroup)

    app.get('/api/github/readme/:owner/:repo', github.getReadMeAsHtml)


  app.get('/api/user', auth.isAuthenticated(), users.getCurrentUser)  
  //app.get('/api/users', auth.hasRole('student|teacher'), users.getUsers)
  app.get('/api/users', auth.hasRole('teacher'), users.getUsers)
  app.get('/api/user/:id', auth.hasRole('teacher|student'), users.getUserById)
  app.patch('/api/user/:id', auth.hasRole('teacher|student'), users.updateUser)

    app.patch('/api/history/:moduleId/:groupId', auth.isAuthenticated(), history.getHistory)

    app.patch('/api/history/:moduleId/:groupId', auth.isAuthenticated(), history.getHistory)
    app.post('/api/history', auth.isAuthenticated(), history.saveAttendances)

    app.get('/api/studentsState/:groupId', auth.hasRole('teacher'), states.getStudentsState)
    app.patch('/api/studentsState', auth.hasRole('teacher'), states.updateUser, states.assignToClass)

    app.get('/auth/github', passport.authenticate('github'))
    app.get('/auth/github/callback', passport.authenticate('github', { session: false, failureRedirect: '/login' }),
        auth.gitHubCallback, auth.setTokenCookie)

    app.get('/api/students', auth.hasRole('teacher|student'), github.getTeamMembers)
    app.get('/user/emails', auth.hasRole('teacher'), github.getUserEmails)
    
    app.patch('/api/set-email', auth.isAuthenticated(), setEmail)

    app.post('/api/githubSync', auth.hasRole('teacher'), githubSync.githubSync)

    app.post('/api/sendEmail', auth.hasRole('teacher|student'), sendGrid.sendAnEmail)


    app.get('/api/students/:groupId', auth.hasRole('teacher|student'), homework.getGroupStudents)
    app.get('/api/assignments/:groupId', auth.hasRole('teacher|student'), homework.getGroupAssignments)
    app.get('/api/submissions/:groupId', auth.hasRole('teacher|student'), homework.getGroupSubmissions)
    app.get('/api/submitters/:assignmentId', auth.hasRole('teacher|student'), homework.getAssignmentSubmitters)
    app.get('/api/reviews/:groupId', auth.hasRole('teacher|student'), homework.getGroupReviews)
    app.post('/api/assignments', auth.hasRole('teacher|student'), homework.addAssignment)
    app.post('/api/submissions', auth.hasRole('teacher|student'), homework.addSubmission)
    app.post('/api/reviews', auth.hasRole('teacher|student'), homework.addReview)




    app.route('/*')
        .get((req, res) => res.sendFile('index.html', { root: app.get('docRoot') }))
}
