const request = require('../../utils/request');

test('function request correctly called', async () => {
  const get = await request('/posts/1');
  const post = await request('/posts', {
    title: 'foo',
    body: 'bar',
    userId: 1
  }, 'POST');

  expect(get).toHaveProperty('userId', 1);
  expect(post).toHaveProperty('userId', 1);
});
