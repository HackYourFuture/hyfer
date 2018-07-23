const github = require('./api/github');
const githubSync = require('./api/githubSync');
const sendGrid = require('./api/sendGrid');
const groupsApi = require('./api/groups');
const modulesApi = require('./api/modules');
const runningModulesApi = require('./api/running-modules');
const usersApi = require('./api/users');
const homeworkApi = require('./api/homework');
const historyApi = require('./api/history');
const { hasRole, router: authApi } = require('./auth/auth-service');

module.exports = (app) => {
  app.use('/api/modules', modulesApi);
  app.use('/api/running', runningModulesApi);
  app.use('/api/groups', groupsApi);
  app.use('/api/user', usersApi);
  app.use('/api/homework', homeworkApi);
  app.use('/api/history', historyApi);
  app.use('/auth/github', authApi);

  app.get('/user/emails', hasRole('teacher'), github.getUserEmails);
  app.post('/api/githubSync/:username', hasRole('teacher'), githubSync.githubSync);
  app.post('/api/sendEmail', hasRole('teacher|student'), sendGrid.sendAnEmail);

  app
    .route('/*')
    .get((req, res) => res.sendFile('index.html', { root: app.get('docRoot') }));
};
