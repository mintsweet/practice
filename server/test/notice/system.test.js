const app = require('../../app');
const request = require('supertest').agent(app);
const should = require('should');
const support = require('../support');

describe('test /api/notice/system', function() {
  let mockUser;

  before(async function() {
    mockUser = await support.createUser('测试', '18800000000');
    await support.createNotice('system', mockUser.id, { content: '测试一条系统消息' });
  });

  after(async function() {
    await support.deleteUser(mockUser.mobile);
    await support.deleteNotice(mockUser.id);
  });

  it('should / status 0 when the not signin', async function() {
    try {
      const res = await request.get('/api/notice/system');

      res.body.status.should.equal(0);
      res.body.type.should.equal('ERROR_NOT_SIGNIN');
      res.body.message.should.equal('尚未登录');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('shoud / status 1', async function() {
    try {
      let res;

      res = await request.post('/api/signin').send({
        mobile: mockUser.mobile,
        password: 'a123456'
      });

      res.body.status.should.equal(1);
      res.body.data.should.have.property('id');
      res.body.data.id.should.equal(mockUser.id);

      res = await request.get('/api/notice/system');

      res.body.status.should.equal(1);
      res.body.data.length.should.equal(1);
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
