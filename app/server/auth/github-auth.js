'use strict'
const passport = require('passport')
const GitHubStrategy = require('passport-github').Strategy
const config = require('../config/config.js')

passport.use(new GitHubStrategy({
  clientID: config.clientID,
  clientSecret: config.clientSecret,
  callbackURL: config.callbackURL
}, (accessToken, refreshToken, profile, done) => {
  const userInfo = {
    accessToken,
    username: profile.username,
    full_name: profile.displayName
  }

  if (profile.emails && profile.emails.length > 0) {
    userInfo.email = profile.emails[0].value
  }

  return done(null, userInfo)
}))
