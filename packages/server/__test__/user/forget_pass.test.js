const app = require('../../app').listen();
const request = require('supertest')(app);
const should = require('should');
const support = require('../support');

describe('test /forget_pass', function() {
  let mockUser;

  before(async function() {
    mockUser = await support.createUser('123456@qq.com', '已注册用户');
  });

  after(async function() {
    await support.deleteUser(mockUser.email);
  });

  it('should / status 400 when the email is invalid', async function() {
    try {
      const res = await request
        .post('/forget_pass')
        .send({
          email: '123456'
        })
        .expect(400);

      res.text.should.equal('邮箱格式错误');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 404 when the user is not exist', async function() {
    try {
      const res = await request
        .post('/forget_pass')
        .send({
          email: '123457@qq.com'
        })
        .expect(404);

      res.text.should.equal('尚未注册');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 200', async function() {
    try {
      await request
        .post('/forget_pass')
        .send({
          email: '123456@qq.com'
        })
        .expect(200);
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
