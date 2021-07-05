const { Types } = require('mongoose');
const app = require('../../app').listen();
const request = require('supertest')(app);
const should = require('should');
const support = require('../support');

describe('test /users/:uid', function() {
  let mockUser;

  before(async function() {
    mockUser = await support.createUser('123456@qq.com');
  });

  after(async function() {
    await support.deleteUser(mockUser.email);
  });

  it('should / status 404 when the user is not exist', async function() {
    try {
      const res = await request.get(`/user/${Types.ObjectId()}`).expect(404);
      res.text.should.equal('用户不存在');
    } catch (err) {
      should.ifError(err.message);
    }
  });

  it('should / status 200', async function() {
    try {
      const res = await request.get(`/user/${mockUser.id}`).expect(200);

      res.body.should.have.property('_id');
      res.body._id.should.equal(mockUser._id.toString());
    } catch (err) {
      should.ifError(err.message);
    }
  });
});
