const path = require('path');
const Base = require('../../controllers/base');
const app = require('../../app').listen();
const request = require('supertest')(app);
const should = require('should');
const support = require('../support');

describe('test /upload_avatar', function() {
  let mockUser;
  let fileName;

  before(async function() {
    mockUser = await support.createUser('123456@qq.com', '已注册用户');
  });

  after(async function() {
    await support.deleteUser(mockUser.email);
    try {
      await Base._deleteImgByQn(path.basename(fileName.text));
    } catch(err) {
      console.error(err);
    }
  });

  it('should / status 401 when the user not signin', async function() {
    try {
      const res = await request
        .post('/upload_avatar')
        .attach('avatar', path.join(__dirname, './fixtures/test.png'))
        .set('Content-Type', 'form-data')
        .expect(401);

      res.text.should.equal('尚未登录');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 200', async function() {
    try {
      const res = await request
        .post('/signin')
        .send({
          email: mockUser.email,
          password: 'a123456'
        })
        .expect(200);

      fileName = await request
        .post('/upload_avatar')
        .attach('avatar', path.join(__dirname, './fixtures/test.png'))
        .set('Authorization', res.text)
        .set('Content-Type', 'form-data')
        .expect(200);

      fileName.text.should.containEql(mockUser.id);
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
