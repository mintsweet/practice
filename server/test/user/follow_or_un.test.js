const app = require('../../app');
const request = require('supertest').agent(app);
const should = require('should');
const support = require('../support');

describe('test /v1/user/:rid/follow_or_un', function() {
  let mockUser;
  let mockUser2;

  before(async function() {
    mockUser = await support.createUser(18800000000, '被关注着');
    mockUser2 = await support.createUser(18800000001, '关注者');
  });

  after(async function() {
    await support.deleteNotice(mockUser.id);
    await support.deleteAction(mockUser2.id);
    await support.deleteUser(mockUser.mobile);
    await support.deleteUser(mockUser2.mobile);
    mockUser = null;
    mockUser2 = null;
  });

  // 错误 - 尚未登录
  it('should / status 0 when the not signin in yet', async function() {
    try {
      const res = await request.patch(`/v1/user/${mockUser2.id}/follow_or_un`);

      res.body.status.should.equal(0);
      res.body.message.should.equal('尚未登录');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  // 正确 - 关注
  it('should / status 1', async function() {
    try {
      let res;

      res = await request.post('/v1/signin').send({
        mobile: mockUser2.mobile,
        password: 'a123456'
      });

      res.body.status.should.equal(1);

      res = await request.patch(`/v1/user/${mockUser.id}/follow_or_un`);

      res.body.status.should.equal(1);
      res.body.data.should.equal('follow');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  // 正确 - 取消关注
  it('should / status 1', async function() {
    try {
      let res;

      res = await request.post('/v1/signin').send({
        mobile: mockUser2.mobile,
        password: 'a123456'
      });

      res.body.status.should.equal(1);

      res = await request.patch(`/v1/user/${mockUser.id}/follow_or_un`);

      res.body.status.should.equal(1);
      res.body.data.should.equal('un_follow');
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
