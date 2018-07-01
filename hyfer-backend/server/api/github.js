const httpRequest = require('request');
const marked = require('marked');
const LRU = require('lru-cache');

const API_END_POINT = 'https://api.github.com';
const ONE_DAY_IN_MSECS = 24 * 60 * 60 * 1000;

const cache = LRU({
  max: 100,
  maxAge: ONE_DAY_IN_MSECS,
});

function httpRequestPromise(url) {
  return new Promise((resolve, reject) => {
    const { GITHUB_TEAM_KEY } = process.env;
    const request = {
      url,
      json: true,
      headers: {
        'User-Agent': 'hackyourfuture',
        Authorization: `token ${GITHUB_TEAM_KEY}`,
      },
    };
    httpRequest.get(request, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        resolve(body);
      } else {
        reject(error);
      }
    });
  });
}

async function getTeamMembers(req, res) {
  try {
    const teams = await httpRequestPromise('https://api.github.com/orgs/hackyourfuture/teams');
    const teamsUrl = teams.map(team => httpRequestPromise(team.url));
    const teamsInfo = await Promise.all(teamsUrl);
    const classTeamPromises = teams.map(classTeam =>
      httpRequestPromise(`https://api.github.com/teams/${classTeam.id}/members?per_page=100`));
    const allClassTeams = await Promise.all(classTeamPromises);
    const studentsPromises = allClassTeams.map((team) => {
      const userPromises = team.map(user => httpRequestPromise(user.url));
      return Promise.all(userPromises);
    });
    const teamsStudents = await Promise.all(studentsPromises);
    const modifiedTeamsStudents = teamsStudents.map((item, i) => ({
      teamName: teamsInfo[i].name,
      created_at: teamsInfo[i].created_at,
      members: item,
    }));
    res.send(modifiedTeamsStudents);
  } catch (error) {
    console.log(res.statusCode);
  }
}

function getUserEmails(req, res) {
  httpRequestPromise(`${API_END_POINT}/user/emails`)
    .then(result => res.send(result))
    .then(userEmails => userEmails[0].email)
    .catch((err) => {
      console.log(err);
      throw new Error("failed to fetch user's emails");
    });
}

function getReadMeAsHtml(req, res) {
  const { owner, repo } = req.params;
  const ownerAndRepo = `${owner}/${repo}`;

  let promise;
  let html = cache.get(ownerAndRepo);
  if (html) {
    console.log(`README cache hit for: ${ownerAndRepo}`);
    promise = Promise.resolve(html);
  } else {
    console.log(`README cache miss for: ${ownerAndRepo}`);
    promise = new Promise((resolve, reject) => {
      const request = {
        url: `${API_END_POINT}/${ownerAndRepo}/readme`,
        json: true,
        headers: {
          'User-Agent': 'hackyourfuture',
        },
      };
      httpRequest.get(request, (error, response, body) => {
        if (!error && response.statusCode === 200) {
          console.log('README received from GitHub');
          const md = Buffer.from(body.content, 'base64').toString();
          html = marked(md, {
            breaks: true,
            smartypants: true,
          });
          cache.set(ownerAndRepo, html);
          resolve(html);
        } else {
          reject(error);
        }
      });
    });
  }

  promise
    .then(data => res.send(data))
    .catch(() => res.sendStatus(404));
}

module.exports = {
  getReadMeAsHtml,
  getTeamMembers,
  getUserEmails,
};
