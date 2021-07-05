const app = require('../../app').listen();
const request = require('supertest')(app);
const should = require('should');
const support = require('../support');

describe('test /v1/notice/system', function() {
  let mockUser;

  before(async function() {
    mockUser = await support.createUser('123456@qq.com');
    await support.createNotice({
      type: 'system',
      uid: mockUser.id,
      content: '测试一条系统消息',
    });
  });

  after(async function() {
    await support.deleteNotice(mockUser.id);
    await support.deleteUser(mockUser.email);
  });

  it('should / status 401 when the not signin', async function() {
    try {
      const res = await request.get('/notice/system').expect(401);
      res.text.should.equal('尚未登录');
    } catch (err) {
      should.ifError(err.message);
    }
  });

  // 正确
  it('should / status 200', async function() {
    try {
      let res = await request
        .post('/signin')
        .send({
          email: mockUser.email,
          password: 'a123456',
        })
        .expect(200);

      res = await request
        .get('/notice/system')
        .set('Authorization', res.text)
        .expect(200);

      res.body.should.be.an.Array();
      res.body.length.should.equal(1);
    } catch (err) {
      should.ifError(err.message);
    }
  });
});
