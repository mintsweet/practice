module.exports = {
  port: 3000,
  mongodb: 'mongodb://localhost/practice',
  session: {
    key: 'practice',
    secret: 'react-demo',
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 2592000000,
    }
  }
}