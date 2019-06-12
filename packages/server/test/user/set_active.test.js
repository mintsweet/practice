const app = require('../../app').listen();
const request = require('supertest')(app);
const should = require('should');
const support = require('../support');

describe('test /set_active', function() {
  const email = '123456@qq.com';

  after(async function() {
    await support.deleteUser(email);
  });

  it('should / status 400 when token is invalid', async function() {
    try {
      const res = await request
        .get('/set_active')
        .query({
          email,
          token: 'xxxxxx'
        })
        .expect(400);

      res.text.should.equal('链接未通过校验');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 200', async function() {
    try {
      const res = await request
        .post('/signup')
        .send({
          email,
          password: 'a123456',
          nickname: '小明',
        })
        .expect(200);

      await request
        .get(res.text)
        .expect(200);
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
