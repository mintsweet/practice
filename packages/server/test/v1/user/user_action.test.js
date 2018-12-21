const app = require('../../../app').listen();
const request = require('supertest')(app);
const should = require('should');
const support = require('../../support');

describe('test /v1/user/:uid/action', function() {
  let mockUser;
  let mockUser2;
  let mockTopic;

  before(async function() {
    mockUser = await support.createUser('123456@qq.com', '行为发起者');
    mockUser2 = await support.createUser('123457@qq.com', '行为无关者');
    mockTopic = await support.createTopic(mockUser.id);
    await support.createAction('like', mockUser.id, mockTopic.id);
    await support.createAction('follow', mockUser.id, mockUser2.id);
  });

  after(async function() {
    await support.deleteAction(mockUser.id);
    await support.deleteTopic({ author_id: mockUser.id });
    await support.deleteUser(mockUser.email);
    await support.deleteUser(mockUser2.email);
  });

  // 正确
  it('should / status 200', async function() {
    try {
      const res = await request
        .get(`/v1/user/${mockUser.id}/action`)
        .expect(200);

      res.body.should.be.Array();
      res.body.length.should.equal(2);
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
