import user from './user';
import common from './common';

export default app => {
  // Entry
  app.get('/api', (req, res) => {
    res.send({
      status: 1,
      message: 'Welcome to use parctice servcie!'
    });
  });

  // Common
  app.use('/api/common', common);

  // User
  app.use('/api/user', user);

  // 404
  app.use((req, res) => {
    res.status(404).send({
      status: 0,
      type: 'ERROR_NOT_FIND_THAT',
      message: 'Sorry can\'t find that!'
    });
  });

  // 500
  app.use((err, req, res) => {
    console.error(err.stack);
    res.status(500).send({
      status: 0,
      type: 'ERROR_SERVICE_NOT_RESP',
      message: 'Something broke!'
    });
  });
}