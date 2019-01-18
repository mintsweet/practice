const app = require('../../app');
const request = require('supertest')(app);

jest.mock('../../../utils/api', () => ({
  getNormsDoc: jest.fn(() => Promise.resolve('# 关于薄荷糖社区(Mints)社区规范'))
}));

test('should / 200', async () => {
  const res = await request
    .get('/static/norms')
    .expect(200);

  expect(res.text).toContain('# 关于薄荷糖社区(Mints)社区规范');
});
