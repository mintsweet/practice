const API = require('../utils/api');

class Github {
  async callback(req, res) {
    const profile = req.user;

    const data = {
      email: profile.emails && profile.emails[0] && profile.emails[0].value,
      nickname: profile.displayName,
      avatar: profile._json.avatar_url,
      location: profile._json.location,
      signature: profile._json.bio,
      githubId: profile.id,
      githubUsername: profile.username,
      githubAccessToken: profile.accessToken,
    };

    await API.signup(data);

    res.redirect('/');
  }
}

module.exports = new Github();
