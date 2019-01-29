const app = require('../../app');
const request = require('supertest')(app);

test('should / status 404', async () => {
  const res = await request
    .get('/lalalala')
    .expect(200);

  expect(res.text).toContain('404');
});
