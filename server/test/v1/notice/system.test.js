const app = require('../../../app').listen();
const request = require('supertest')(app);
const should = require('should');
const support = require('../../support');

describe('test /v1/notice/system', function() {
  let mockUser;

  before(async function() {
    mockUser = await support.createUser(18800000000, '测试');
    await support.createNotice('system', mockUser.id, { content: '测试一条系统消息' });
  });

  after(async function() {
    await support.deleteUser(mockUser.mobile);
    await support.deleteNotice(mockUser.id);
  });

  it('should / status 401 when the not signin', async function() {
    try {
      const res = await request.get('/v1/notice/system');

      res.status.should.equal(401);
      res.error.text.should.equal('需要用户登录权限');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  // 正确
  it('shoud / status 200', async function() {
    try {
      let res;

      res = await request.post('/v1/signin').send({
        mobile: mockUser.mobile,
        password: 'a123456'
      });

      res.status.should.equal(200);

      res = await request.get('/v1/notice/system').set('Authorization', res.text);

      res.status.should.equal(200);
      res.body.length.should.equal(1);
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
