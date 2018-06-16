const github = require('./api/github');
const githubSync = require('./api/githubSync');
const sendGrid = require('./api/sendGrid');
const timelineApi = require('./api/timeline');
const groupsApi = require('./api/groups');
const modulesApi = require('./api/modules');
const runningModulesApi = require('./api/running-modules');
const usersApi = require('./api/users');
const homeworkApi = require('./api/homework');
const historyApi = require('./api/history');
const states = require('./api/states');
const { setEmail } = require('./api/update-email');
const { isAuthenticated, hasRole, router: authApi } = require('./auth/auth-service');

module.exports = (app) => {
  app.use('/api/modules', modulesApi);
  app.use('/api/running', runningModulesApi);
  app.use('/api/timeline', timelineApi);
  app.use('/api/groups', groupsApi);
  app.use('/api/user', usersApi);
  app.use('/api/homework', homeworkApi);
  app.use('/api/history', historyApi);
  app.use('/auth/github', authApi);

  // TODO: restructure these routes using router modules
  app.get('/api/studentsState/:groupId', hasRole('teacher'), states.getStudentsState);
  app.patch('/api/studentsState', hasRole('teacher'), states.updateUser, states.assignToClass);
  app.get('/api/students', hasRole('teacher|student'), github.getTeamMembers);
  app.get('/user/emails', hasRole('teacher'), github.getUserEmails);
  app.post('/api/githubSync', hasRole('teacher'), githubSync.githubSync);
  app.patch('/api/set-email', isAuthenticated(), setEmail);
  app.post('/api/sendEmail', hasRole('teacher|student'), sendGrid.sendAnEmail);

  app
    .route('/*')
    .get((req, res) => res.sendFile('index.html', { root: app.get('docRoot') }));
};
