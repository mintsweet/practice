const app = require('../../../app').listen();
const request = require('supertest')(app);
const should = require('should');
const support = require('../../support');

describe('test /v1/user/:rid/follow_or_un', function() {
  let mockUser;
  let mockUser2;

  before(async function() {
    mockUser = await support.createUser('123456@qq.com', '被关注着');
    mockUser2 = await support.createUser('123457@qq.com', '关注者');
  });

  after(async function() {
    await support.deleteNotice(mockUser.id);
    await support.deleteAction(mockUser2.id);
    await support.deleteUser(mockUser.email);
    await support.deleteUser(mockUser2.email);
  });

  it('should / status 401 when the not signin', async function() {
    try {
      const res = await request
        .patch(`/v1/user/${mockUser2.id}/follow_or_un`)
        .expect(401);

      res.text.should.equal('尚未登录');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 403 when the user is yourselft', async function() {
    try {
      let res = await request
        .post('/signin')
        .send({
          email: mockUser.email,
          password: 'a123456'
        })
        .expect(200);

      res = await request
        .patch(`/v1/user/${mockUser.id}/follow_or_un`)
        .set('Authorization', res.text)
        .expect(403);

      res.text.should.equal('不能关注你自己');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 200 when the action is follow', async function() {
    try {
      let res = await request
        .post('/signin')
        .send({
          email: mockUser2.email,
          password: 'a123456'
        })
        .expect(200);

      res = await request
        .patch(`/v1/user/${mockUser.id}/follow_or_un`)
        .set('Authorization', res.text)
        .expect(200);

      res.text.should.equal('follow');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 200 when the action is un_follow', async function() {
    try {
      let res = await request
        .post('/signin')
        .send({
          email: mockUser2.email,
          password: 'a123456'
        })
        .expect(200);

      res = await request
        .patch(`/v1/user/${mockUser.id}/follow_or_un`)
        .set('Authorization', res.text)
        .expect(200);

      res.text.should.equal('un_follow');
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
