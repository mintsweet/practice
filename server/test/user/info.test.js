const app = require('../../app');
const request = require('supertest').agent(app);
const should = require('should');
const support = require('../support');

describe('test /v1/info', function() {
  let mockUser;

  before(async function() {
    mockUser = await support.createUser(18800000000, '已注册用户');
  });

  after(async function() {
    await support.deleteUser(mockUser.mobile);
    mockUser = null;
  });

  // 错误 - 尚未登录
  it('should / status 0 when the not signin', async function() {
    try {
      const res = await request.get('/v1/info');

      res.body.status.should.equal(0);
      res.body.message.should.equal('尚未登录');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  // 正确
  it('should / status 1', async function() {
    try {
      let res;

      res = await request.post('/v1/signin').send({
        mobile: mockUser.mobile,
        password: 'a123456'
      });

      res.body.status.should.equal(1);

      res = await request.get('/v1/info');

      res.body.status.should.equal(1);
      res.body.data.should.have.property('id');
      res.body.data.id.should.equal(mockUser.id);
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
