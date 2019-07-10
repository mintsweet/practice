const app = require('../../../app').listen();
const request = require('supertest')(app);
const should = require('should');
const support = require('../../support');

describe('test /v1/user/:uid/following', function() {
  let mockUser;
  let mockUser2;

  before(async function() {
    mockUser = await support.createUser('123456@qq.com', '被关注者');
    mockUser2 = await support.createUser('123457@qq.com', '关注者');
    await support.createAction('follow', mockUser2.id, mockUser.id);
  });

  after(async function() {
    await support.deleteAction(mockUser2.id);
    await support.deleteUser(mockUser.email);
    await support.deleteUser(mockUser2.email);
  });

  it('should / status 200', async function() {
    try {
      const res = await request
        .get(`/v1/user/${mockUser2.id}/following`)
        .expect(200);

      res.body.should.be.Array();
      res.body.length.should.equal(1);
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
