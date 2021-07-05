const { Types } = require('mongoose');
const app = require('../../app').listen();
const request = require('supertest')(app);
const should = require('should');
const support = require('../support');

describe('test /api/topic/:tid', function() {
  let mockUser;
  let mockUser2;
  let mockTopic;

  before(async function() {
    mockUser = await support.createUser('123456@qq.com');
    mockUser2 = await support.createUser('123457@qq.com');
    mockTopic = await support.createTopic(mockUser._id);
  });

  after(async function() {
    await support.deleteTopic(mockUser._id);
    await support.deleteUser(mockUser.email);
    await support.deleteUser(mockUser2.email);
  });

  it('should / status 404 when the topic does not exist', async function() {
    try {
      const res = await request.get(`/topic/${Types.ObjectId()}`).expect(404);

      res.text.should.equal('话题不存在');
    } catch (err) {
      should.ifError(err.message);
    }
  });

  it('should / status 200', async function() {
    try {
      const res = await request.get(`/topic/${mockTopic.id}`).expect(200);

      res.body.author_id.should.equal(mockUser._id.toString());
    } catch (err) {
      should.ifError(err.message);
    }
  });
});
