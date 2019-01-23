const app = require('../../app');
const request = require('supertest')(app);
const md2html = require('../../utils/md2html');

jest.mock('../../utils/md2html.js');

test('should / status 200', async () => {
  const res = await request
    .get('/static/norms')
    .expect(200);

  expect(res.text).toContain('社区规范');
  expect(md2html).toHaveBeenCalled();
  expect(md2html).toHaveBeenCalledTimes(1);
});
