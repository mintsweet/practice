const app = require('../../../app').listen();
const request = require('supertest')(app);
const should = require('should');
const support = require('../../support');

describe('test /v2/topic/:tid/good', function() {
  let mockTopic;
  let mockUser;
  let mockUser2;

  before(async function() {
    mockUser = await support.createUser('18800000000', '普通用户');
    mockUser2 = await support.createUser('18800000001', '管理员', { role: 1 });
    mockTopic = await support.createTopic(mockUser.id);
  });

  after(async function() {
    await support.deleteTopic(mockUser.id);
    await support.deleteUser(mockUser.mobile);
    await support.deleteUser(mockUser2.mobile);
  });

  it('should / status 401 when the not sigin', async function() {
    try {
      const res = await request.patch(`/v2/topic/${mockTopic.id}/good`).expect(401);

      res.body.text = '需要用户权限';
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 401 when the no permission', async function() {
    try {
      let res = await request.post('/v1/signin').send({
        mobile: mockUser.mobile,
        password: 'a123456'
      }).expect(200);

      res = await request.patch(`/v2/topic/${mockTopic.id}/good`).set('Authorization', res.text).expect(401);

      res.body.text = '需要管理员权限';
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 200 when the action is good', async function() {
    try {
      let res = await request.post('/v1/signin').send({
        mobile: mockUser2.mobile,
        password: 'a123456'
      }).expect(200);

      res = await request.patch(`/v2/topic/${mockTopic.id}/good`).set('Authorization', res.text).expect(200);

      res.body.text = 'good';
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 200 when the action is un_good', async function() {
    try {
      let res = await request.post('/v1/signin').send({
        mobile: mockUser2.mobile,
        password: 'a123456'
      }).expect(200);

      res = await request.patch(`/v2/topic/${mockTopic.id}/good`).set('Authorization', res.text).expect(200);

      res.body.text = 'un_good';
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
