const app = require('../../../app').listen();
const request = require('supertest')(app);
const should = require('should');
const support = require('../../support');
const tempId = require('mongoose').Types.ObjectId();

describe('test /v1/users/:uid', function() {
  let mockUser;
  let mockUser2;

  before(async function() {
    mockUser = await support.createUser('18800000000', '已注册用户');
    mockUser2 = await support.createUser('18800000001', '访问用户');
  });

  after(async function() {
    await support.deleteUser(mockUser.mobile);
    await support.deleteUser(mockUser2.mobile);
  });

  it('should / status 410 when the user is not exist', async function() {
    try {
      const res = await request.get(`/v1/user/${tempId}`).expect(410);

      res.text.should.equal('用户不存在');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 200 when the not signin', async function() {
    try {
      const res = await request.get(`/v1/user/${mockUser.id}`).expect(200);

      res.body.should.have.property('id');
      res.body.id.should.equal(mockUser.id);
      res.body.follow.should.equal(false);
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 200 when the signin', async function() {
    try {
      let res = await request.post('/v1/signin').send({
        mobile: mockUser2.mobile,
        password: 'a123456'
      });

      res = await request.get(`/v1/user/${mockUser.id}`).set('Authorization', res.text).expect(200);

      res.body.should.have.property('id');
      res.body.id.should.equal(mockUser.id);
      res.body.follow.should.equal(false);
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
