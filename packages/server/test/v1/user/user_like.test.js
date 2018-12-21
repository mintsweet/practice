const app = require('../../../app').listen();
const request = require('supertest')(app);
const should = require('should');
const support = require('../../support');

describe('test /v1/user/:uid/like', function() {
  let mockUser;
  let mockTopic;

  before(async function() {
    mockUser = await support.createUser('123456@qq.com', '已经注册者');
    mockTopic = await support.createTopic(mockUser.id);
    await support.createAction('like', mockUser.id, mockTopic.id);
  });

  after(async function() {
    await support.deleteAction(mockUser.id);
    await support.deleteTopic({ author_id: mockUser.id });
    await support.deleteUser(mockUser.email);
  });

  it('should / status 200', async function() {
    try {
      const res = await request
        .get(`/v1/user/${mockUser.id}/like`)
        .expect(200);

      res.body.should.be.Array();
      res.body.length.should.equal(1);
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
