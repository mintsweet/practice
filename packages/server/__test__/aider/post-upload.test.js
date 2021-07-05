const path = require('path');
const app = require('../../app').listen();
const request = require('supertest')(app);
const should = require('should');
const support = require('../support');

describe('test /upload', function() {
  let mockUser;

  before(async function() {
    mockUser = await support.createUser('123456@qq.com');
  });

  after(async function() {
    await support.deleteUser(mockUser.email);
  });

  it('should / status 401 when the user not signin', async function() {
    try {
      const res = await request
        .post('/upload')
        .attach('file', path.join(__dirname, './fixtures/test.png'))
        .set('Content-Type', 'form-data')
        .expect(401);

      res.text.should.equal('尚未登录');
    } catch (err) {
      should.ifError(err.message);
    }
  });

  it('should / status 200', async function() {
    try {
      const res = await request
        .post('/signin')
        .send({
          email: mockUser.email,
          password: 'a123456',
        })
        .expect(200);

      const filename = await request
        .post('/upload')
        .attach('file', path.join(__dirname, './fixtures/test.png'))
        .set('Authorization', res.text)
        .set('Content-Type', 'form-data')
        .expect(200);

      filename.text.should.containEql(mockUser.id);
    } catch (err) {
      should.ifError(err.message);
    }
  });
});
