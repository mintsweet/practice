const app = require('../app');
const request = require('supertest')(app);

test('should / 200', async () => {
  const res = await request
    .get('/')
    .expect(200);

  expect(res.text).toContain('Hello,World!');
});
