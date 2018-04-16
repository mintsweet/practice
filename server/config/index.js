export default {
  port: 3005,
  mongodb: 'mongodb://192.168.10.216:27017/practice',
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