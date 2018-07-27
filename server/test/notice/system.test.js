const app = require('../../app');
const request = require('supertest').agent(app);
const should = require('should');
const support = require('../support');

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

  // 错误 - 尚未登录
  it('should / status 0 when the not signin', async function() {
    try {
      const res = await request.get('/v1/notice/system');

      res.body.status.should.equal(0);
      res.body.message.should.equal('尚未登录');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  // 正确
  it('shoud / status 1', async function() {
    try {
      let res;

      res = await request.post('/v1/signin').send({
        mobile: mockUser.mobile,
        password: 'a123456'
      });

      res.body.status.should.equal(1);

      res = await request.get('/v1/notice/system');

      res.body.status.should.equal(1);
      res.body.data.length.should.equal(1);
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
