const express = require('express');
const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const compose = require('composable-middleware');
const { getUserByUsername, addUser } = require('../datalayer/users');
const { getConnection } = require('../api/connection');

const validateJwt = expressJwt({ secret: process.env.JWT_SECRET });
const EXPIRES_IN_SECONDS = 30 * 24 * 60 * 60; // 30 days

passport.use(new GitHubStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: process.env.CALLBACK_URL,
}, (accessToken, refreshToken, profile, done) => {
  const userInfo = {
    accessToken,
    username: profile.username,
    full_name: profile.displayName,
  };
  if (profile.emails && profile.emails.length > 0) {
    userInfo.email = profile.emails[0].value;
  }
  done(null, userInfo);
}));

async function gitHubCallback(req, res, next) {
  try {
    const con = await getConnection(req, res);
    const rows = await getUserByUsername(con, req.user.username);
    if (rows.length === 0) {
      const newUser = {
        username: req.user.username,
        full_name: req.user.full_name,
        email: req.user.email,
        role: 'guest',
      };
      await addUser(con, newUser);
    }
    next();
  } catch (err) {
    res.status(500).json(err);
  }
}

function isAuthenticated() {
  return compose()
    .use((req, res, next) => validateJwt(req, res, next))
    .use(async (req, res, next) => {
      try {
        const con = await getConnection(req, res);
        const rows = await getUserByUsername(con, req.user.username);
        if (rows.length > 0) {
          [req.user] = rows;
          next();
        } else {
          res.sendStatus(403);
        }
      } catch (err) {
        res.status(500).json(err);
      }
    });
}

function hasRole(params) {
  const roles = params.split('|');
  return compose()
    .use(isAuthenticated())
    .use((req, res, next) => {
      if (roles.indexOf(req.user.role) === -1) {
        res.sendStatus(403);
      } else {
        next();
      }
    });
}

function signToken(username) {
  return jwt.sign({ username }, process.env.JWT_SECRET, {
    expiresIn: EXPIRES_IN_SECONDS,
  });
}

function setTokenCookie(req, res) {
  if (!req.user) {
    res.statusStatus(404);
    return;
  }
  const token = signToken(req.user.username);
  res.cookie('token', JSON.stringify(token));
  res.redirect(`${process.env.CLIENT_URL}/timeline`);
}

const router = express.Router();
router
  .get('/', passport.authenticate('github'))
  .get(
    '/callback',
    passport.authenticate('github', {
      session: false,
      failureRedirect: '/login',
    }),
    gitHubCallback,
    setTokenCookie
  );

module.exports = {
  router,
  isAuthenticated,
  hasRole,
};
