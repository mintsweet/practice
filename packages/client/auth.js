const passport = require('passport');
const { Strategy: GitHubStrategy } = require('passport-github');
const { github: { CLIENT_ID, CLIENT_SECRET, CALLBACK_URL } } = require('../../config');

passport.use(new GitHubStrategy(
  {
    clientID: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    callbackURL: CALLBACK_URL
  },
  (accessToken, refreshToken, profile, cb) => {
    return cb(null, accessToken);
  }
));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));
