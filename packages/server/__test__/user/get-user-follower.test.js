const app = require('../../app').listen();
const request = require('supertest')(app);
const should = require('should');
const support = require('../support');

describe('test /user/:uid/follower', function() {
  let mockUser;
  let mockUser2;

  before(async function() {
    mockUser = await support.createUser('123456@qq.com');
    mockUser2 = await support.createUser('123457@qq.com', {
      nickname: '关注者',
    });
    await support.createAction({
      type: 'follow',
      aid: mockUser2.id,
      tid: mockUser.id,
    });
  });

  after(async function() {
    await support.deleteAction(mockUser2._id);
    await support.deleteUser(mockUser.email);
    await support.deleteUser(mockUser2.email);
  });

  it('should / status 200', async function() {
    try {
      const res = await request
        .get(`/user/${mockUser._id}/follower`)
        .expect(200);

      res.body.should.be.Array();
      res.body.length.should.equal(1);
    } catch (err) {
      should.ifError(err.message);
    }
  });
});
