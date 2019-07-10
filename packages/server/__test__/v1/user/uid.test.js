const app = require('../../../app').listen();
const request = require('supertest')(app);
const should = require('should');
const support = require('../../support');
const tempId = require('mongoose').Types.ObjectId();

describe('test /v1/users/:uid', function() {
  let mockUser;

  before(async function() {
    mockUser = await support.createUser('123456@qq.com', '已注册用户');
  });

  after(async function() {
    await support.deleteUser(mockUser.email);
  });

  it('should / status 404 when the user is not exist', async function() {
    try {
      const res = await request
        .get(`/v1/user/${tempId}`)
        .expect(404);

      res.text.should.equal('用户不存在');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 200', async function() {
    try {
      const res = await request
        .get(`/v1/user/${mockUser.id}`)
        .expect(200);

      res.body.should.have.property('id');
      res.body.id.should.equal(mockUser.id);
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
