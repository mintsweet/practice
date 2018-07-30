const app = require('../../../app').listen();
const request = require('supertest')(app);
const should = require('should');
const support = require('../../support');

describe('test /v1/user/:uid/follower', function() {
  let mockUser;
  let mockUser2;

  before(async function() {
    mockUser = await support.createUser('18800000000', '被关注者');
    mockUser2 = await support.createUser('18800000001', '关注者');
    await support.createAction('follow', mockUser2.id, mockUser.id);
  });

  after(async function() {
    await support.deleteAction(mockUser2.id);
    await support.deleteUser(mockUser.mobile);
    await support.deleteUser(mockUser2.mobile);
  });

  it('should / status 200', async function() {
    try {
      const res = await request.get(`/v1/user/${mockUser.id}/follower`).expect(200);

      res.body.should.be.Array();
      res.body.length.should.equal(1);
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
