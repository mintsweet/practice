const app = require('../../app').listen();
const request = require('supertest')(app);
const should = require('should');
const support = require('../support');

describe('test /user/:uid/follow', function() {
  let mockUser;
  let mockUser2;

  before(async function() {
    mockUser = await support.createUser('123456@qq.com');
    mockUser2 = await support.createUser('123457@qq.com', {
      nickname: '关注者',
    });
  });

  after(async function() {
    await support.deleteNotice(mockUser._id);
    await support.deleteAction(mockUser2._id);
    await support.deleteUser(mockUser.email);
    await support.deleteUser(mockUser2.email);
  });

  it('should / status 401 when the not signin', async function() {
    try {
      const res = await request
        .put(`/user/${mockUser2._id}/follow`)
        .expect(401);

      res.text.should.equal('尚未登录');
    } catch (err) {
      should.ifError(err.message);
    }
  });

  it('should / status 403 when the user is yourselft', async function() {
    try {
      let res = await request
        .post('/signin')
        .send({
          email: mockUser.email,
          password: 'a123456',
        })
        .expect(200);

      res = await request
        .put(`/user/${mockUser._id}/follow`)
        .set('Authorization', res.text)
        .expect(403);

      res.text.should.equal('不能操作自身');
    } catch (err) {
      should.ifError(err.message);
    }
  });

  it('should / status 200', async function() {
    try {
      let res = await request
        .post('/signin')
        .send({
          email: mockUser2.email,
          password: 'a123456',
        })
        .expect(200);

      res = await request
        .put(`/user/${mockUser._id}/follow`)
        .set('Authorization', res.text)
        .expect(200);

      res.text.should.equal('');
    } catch (err) {
      should.ifError(err.message);
    }
  });
});
