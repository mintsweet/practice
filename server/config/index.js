export default {
  port: 3005,
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