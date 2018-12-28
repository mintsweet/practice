const app = require('../../../app').listen();
const request = require('supertest')(app);
const should = require('should');
const support = require('../../support');

describe('test /v2/topic/:tid/lock', function() {
  let mockTopic;
  let mockUser;
  let mockUser2;

  before(async function() {
    mockUser = await support.createUser('123456@qq.com', '普通用户');
    mockUser2 = await support.createUser('123457@qq.com', '管理员', { role: 1 });
    mockTopic = await support.createTopic(mockUser.id);
  });

  after(async function() {
    await support.deleteTopic({ author_id: mockUser.id });
    await support.deleteUser(mockUser.email);
    await support.deleteUser(mockUser2.email);
  });

  it('should / status 401 when the not sigin', async function() {
    try {
      const res = await request
        .patch(`/v2/topic/${mockTopic.id}/lock`)
        .expect(401);

      res.text.should.equal('尚未登录');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 403 when the no permission', async function() {
    try {
      let res = await request
        .post('/v1/signin')
        .send({
          email: mockUser.email,
          password: 'a123456'
        })
        .expect(200);

      res = await request
        .patch(`/v2/topic/${mockTopic.id}/lock`)
        .set('Authorization', res.text)
        .expect(403);

      res.text.should.equal('需要管理员权限');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 200 when the action is lock', async function() {
    try {
      let res = await request
        .post('/v1/signin')
        .send({
          email: mockUser2.email,
          password: 'a123456'
        })
        .expect(200);

      res = await request
        .patch(`/v2/topic/${mockTopic.id}/lock`)
        .set('Authorization', res.text)
        .expect(200);

      res.text.should.equal('lock');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 200 when the action is un_lock', async function() {
    try {
      let res = await request
        .post('/v1/signin')
        .send({
          email: mockUser2.email,
          password: 'a123456'
        })
        .expect(200);

      res = await request
        .patch(`/v2/topic/${mockTopic.id}/lock`)
        .set('Authorization', res.text)
        .expect(200);

      res.text.should.equal('un_lock');
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
