const app = require('../../app').listen();
const request = require('supertest')(app);
const should = require('should');
const support = require('../support');

describe('test /user/:uid/action', function() {
  let mockUser;
  let mockUser2;
  let mockTopic;

  before(async function() {
    mockUser = await support.createUser('123456@qq.com', {
      nickname: '行为发起者',
    });
    mockUser2 = await support.createUser('123457@qq.com', {
      nickname: '行为无关者',
    });

    mockTopic = await support.createTopic(mockUser._id);

    await support.createAction({
      type: 'like',
      aid: mockUser._id,
      tid: mockTopic._id,
    });

    await support.createAction({
      type: 'follow',
      aid: mockUser._id,
      tid: mockUser2._id,
    });
  });

  after(async function() {
    await support.deleteAction(mockUser._id);
    await support.deleteTopic(mockUser._id);
    await support.deleteUser(mockUser.email);
    await support.deleteUser(mockUser2.email);
  });

  // 正确
  it('should / status 200', async function() {
    try {
      const res = await request
        .get(`/user/${mockUser._id}/action`)
        .expect(200);

      res.body.should.be.Array();
      res.body.length.should.equal(2);
    } catch (err) {
      should.ifError(err.message);
    }
  });
});
