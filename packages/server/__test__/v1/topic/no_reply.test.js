const app = require('../../../app').listen();
const request = require('supertest')(app);
const should = require('should');
const support = require('../../support');

describe('test /v1/topics/no_reply', function() {
  let mockUser;

  before(async function() {
    mockUser = await support.createUser('123456@qq.com', '话题创建者');
    await support.createTopic(mockUser.id);
    await support.createTopic(mockUser.id);
  });

  after(async function() {
    await support.deleteTopic({ author_id: mockUser.id });
    await support.deleteUser(mockUser.email);
  });

  it('should / status 200', async function() {
    try {
      const res = await request
        .get('/v1/topics/no_reply')
        .expect(200);

      res.body.length.should.equal(2);
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
