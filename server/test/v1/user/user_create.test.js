const app = require('../../../app').listen();
const request = require('supertest')(app);
const should = require('should');
const support = require('../../support');

describe('test /v1/user/:uid/create', function() {
  let mockUser;
  let mockTopic;

  before(async function() {
    mockUser = await support.createUser('18800000000', '文章创建者');
    mockTopic = await support.createTopic(mockUser.id);
    await support.createAction('create', mockUser.id, mockTopic.id);
  });

  after(async function() {
    await support.deleteAction(mockUser.id);
    await support.deleteTopic(mockUser.id);
    await support.deleteUser(mockUser.mobile);
    mockUser = null;
    mockTopic = null;
  });

  it('should / status 200', async function() {
    try {
      const res = await request.get(`/v1/user/${mockUser.id}/create`).expect(200);

      res.body.should.be.Array();
      res.body.length.should.equal(1);
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
