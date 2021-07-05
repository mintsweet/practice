const app = require('../../app').listen();
const request = require('supertest')(app);
const should = require('should');
const support = require('../support');

describe('test /topics/no-reply', function() {
  let mockUser;

  before(async function() {
    mockUser = await support.createUser('123456@qq.com');
    await support.createTopic(mockUser._id);
  });

  after(async function() {
    await support.deleteTopic(mockUser._id);
    await support.deleteUser(mockUser.email);
  });

  it('should / status 200', async function() {
    try {
      const res = await request.get('/topics/no-reply').expect(200);

      res.body.length.should.equal(1);
    } catch (err) {
      should.ifError(err.message);
    }
  });
});
