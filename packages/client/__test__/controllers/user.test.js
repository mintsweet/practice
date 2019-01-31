const app = require('../../app');
const request = require('supertest')(app);

jest.mock('../../utils/api.js', () => ({
  getCaptcha: jest.fn().mockReturnValue({ token: '1U2CB', url: 'xxxxx' }),
  signup: jest.fn().mockResolvedValue(),
  signin: jest.fn().mockResolvedValue()
}));

test('should / status 200', async () => {
  const res = await request
    .get('/signup')
    .expect(200);

  expect(res.text).toContain('注册');
});

test('should / status 200', async () => {
  const res = await request
    .post('/signup')
    .send({
      nickname: '测试名称',
      email: '123456@qq.com',
      password: 'a123456',
      captcha: 'ABCDE'
    })
    .expect(200);

  expect(res.text).toContain('图形验证码错误');
});

test('should / status 200', async () => {
  const now = Date.now() + 1000 * 60 * 11;
  Date.now = jest.fn(() => now);

  const res = await request
    .post('/signup')
    .send({
      nickname: '测试名称',
      email: '123456@qq.com',
      password: 'a123456',
      captcha: '1U2CB'
    })
    .expect(200);

  expect(res.text).toContain('图形验证码已经失效了，请重新获取');
});

test('should / status 200', async () => {
  const res = await request
    .post('/signup')
    .send({
      nickname: '测试名称',
      email: '123456@qq.com',
      password: 'a123456',
      captcha: '1U2CB'
    })
    .expect(200);

  expect(res.text).toContain('注册成功');
});

test('should / status 200', async () => {
  const res = await request
    .get('/signin')
    .expect(200);

  expect(res.text).toContain('登录');
});

test('should / status 200', async () => {
  const res = await request
    .post('/signin')
    .send({
      email: '123456@qq.com',
      password: 'a123456',
      captcha: 'ABCDE'
    })
    .expect(200);

  expect(res.text).toContain('图形验证码错误');
});

test('should / status 200', async () => {
  const now = Date.now() + 1000 * 60 * 11;
  Date.now = jest.fn(() => now);

  const res = await request
    .post('/signin')
    .send({
      email: '123456@qq.com',
      password: 'a123456',
      captcha: '1U2CB'
    })
    .expect(200);

  expect(res.text).toContain('图形验证码已经失效了，请重新获取');
});

test('should / status 200', async () => {
  const res = await request
    .post('/signin')
    .send({
      email: '123456@qq.com',
      password: 'a123456',
      captcha: '1U2CB'
    })
    .expect(200);

  expect(res.text).toContain('登录成功');
});

test('should / status 200', async () => {
  const res = await request
    .get('/forget_pass')
    .expect(200);

  expect(res.text).toContain('忘记密码');
});

test('should / status 200', async () => {
  const res = await request
    .post('/forget_pass')
    .send({
      email: '123456@qq.com',
      captcha: 'ABCDE'
    })
    .expect(200);

  expect(res.text).toContain('图形验证码错误');
});

test('should / status 200', async () => {
  const now = Date.now() + 1000 * 60 * 11;
  Date.now = jest.fn(() => now);

  const res = await request
    .post('/forget_pass')
    .send({
      email: '123456@qq.com',
      captcha: '1U2CB'
    })
    .expect(200);

  expect(res.text).toContain('图形验证码已经失效了，请重新获取');
});

test('should / status 200', async () => {
  const res = await request
    .post('/forget_pass')
    .send({
      email: '123456@qq.com',
      captcha: '1U2CB'
    })
    .expect(200);

  expect(res.text).toContain('发送至邮箱');
});

