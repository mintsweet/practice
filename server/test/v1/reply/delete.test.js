const app = require('../../../app').listen();
const request = require('supertest')(app);
const should = require('should');
const support = require('../../support');
const tempId = require('mongoose').Types.ObjectId();

describe('test /v1/reply/:rid/delete', function() {
  let mockUser;
  let mockUser2;
  let mockTopic;
  let mockReply;

  before(async function() {
    mockUser = await support.createUser('18800000000', '话题创建者');
    mockUser2 = await support.createUser('18800000001', '回复者');
    mockTopic = await support.createTopic(mockUser.id);
    mockReply = await support.createReply(mockUser2.id, mockTopic.id);
  });

  after(async function() {
    await support.deleteTopic(mockUser.id);
    await support.deleteUser(mockUser.mobile);
    await support.deleteUser(mockUser2.mobile);
  });

  it('should / status 401 when the not signin', async function() {
    try {
      const res = await request.delete(`/v1/reply/${mockReply.id}/delete`).expect(401);

      res.text.should.equal('需要用户权限');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 410 when the reply does not exist', async function() {
    try {
      let res = await request.post('/v1/signin').send({
        mobile: mockUser.mobile,
        password: 'a123456'
      }).expect(200);

      res = await request.delete(`/v1/reply/${tempId}/delete`).set('Authorization', res.text).expect(410);

      res.text.should.equal('回复不存在');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 403 when the reply not yours', async function() {
    try {
      let res = await request.post('/v1/signin').send({
        mobile: mockUser.mobile,
        password: 'a123456'
      }).expect(200);

      res = await request.delete(`/v1/reply/${mockReply.id}/delete`).set('Authorization', res.text).expect(403);

      res.text.should.equal('不能删除别人的回复');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 200', async function() {
    try {
      const res = await request.post('/v1/signin').send({
        mobile: mockUser2.mobile,
        password: 'a123456'
      }).expect(200);

      await request.delete(`/v1/reply/${mockReply.id}/delete`).set('Authorization', res.text).expect(200);
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
