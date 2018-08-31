const app = require('../../app');
const request = require('supertest')(app);
const should = require('should');

describe('test /controllers/user.js', function() {
  it('should get /signup', async function() {
    try {
      const res = await request.get('/signup').expect(200);

      res.text.should.containEql('用户注册');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should post /signup', async function() {
    try {
      const res = await request.post('/signup').send({
        mobile: '18800000000',
        password: 'a123456',
        nickname: '小熊牛逼',
        sms: '123456'
      }).expect(200);

      res.text.should.containEql('尚未获取短信验证码');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should post /signup', async function() {
    try {
      let res = await request.get('/aider/sms_code').query({
        mobile: '18800000000'
      }).expect(200);

      res = await request.post('/signup').send({
        mobile: '18800000000',
        password: 'a123456',
        nickname: '小熊牛逼',
        sms: res.body.data
      }).expect(200);

      res.text.should.containEql('注册成功');
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
