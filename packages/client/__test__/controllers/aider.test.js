const app = require('../../app');
const request = require('supertest')(app);

jest.mock('../../utils/api.js', () => ({
  getCaptcha: jest.fn().mockReturnValue({ token: '1U2CB', url: 'xxxxx' }),
}));

test('should / status 200', async () => {
  const res = await request
    .get('/aider/captcha')
    .expect(200);

  expect(res.body.status).toEqual(1);
  expect(res.body.url).toContain('xxx');
});
