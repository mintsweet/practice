const app = require('../../app');
const request = require('supertest').agent(app);
const should = require('should');
const support = require('../support');

describe('test /api/notice/user', function() {
  let mockUser;

  before(async function() {
    mockUser = await support.createUser('测试', '18800000000');
  });

  after(async function() {
    await support.deleteUser(mockUser.mobile);
  });

  // 错误 - 尚未登录
  it('should return status 0 when the not signin', async function() {
    try {
      const res = await request.get('/api/notice/user');
      res.body.status.should.equal(0);
      res.body.type.should.equal('ERROR_NOT_SIGNIN');
      res.body.message.should.equal('尚未登录');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  // 正确
  it('shoud return status 1', async function() {
    try {
      let res;

      res = await request.post('/api/signin').send({
        mobile: mockUser.mobile,
        password: 'a123456'
      });
      res.body.status.should.equal(1);
      res.body.data.should.have.property('id');
      res.body.data.id.should.equal(mockUser.id);

      res = await request.get('/api/notice/user');
      res.body.status.should.equal(1);
      res.body.data.length.should.equal(0);
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
