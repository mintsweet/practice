const app = require('../../app');
const request = require('supertest').agent(app);
const should = require('should');
const support = require('../support');

describe('test /v1/topics/list', function() {
  let mockUser;

  before(async function() {
    mockUser = await support.createUser(18800000000, '话题创建者');
    await support.createTopic(mockUser.id);
    await support.createTopic(mockUser.id);
  });

  after(async function() {
    await support.deleteUser(mockUser.mobile);
    await support.deleteTopic(mockUser.id);
    mockUser = null;
  });

  // 正确 - 默认
  it('should / status 1', async function() {
    try {
      const res = await request.get('/v1/topics/list');

      res.body.status.should.equal(1);
      res.body.data.topics.length.should.equal(2);
      res.body.data.currentPage.should.equal(1);
      res.body.data.total.should.equal(2);
      res.body.data.totalPage.should.equal(1);
      res.body.data.tab.should.equal('all');
      res.body.data.size.should.equal(10);
    } catch(err) {
      should.ifError(err.message);
    }
  });

  // 正确 - 精华话题
  it('should / status 1', async function() {
    try {
      const res = await request.get('/v1/topics/list').query({
        tab: 'good'
      });

      res.body.status.should.equal(1);
      res.body.data.topics.length.should.equal(0);
      res.body.data.currentPage.should.equal(1);
      res.body.data.total.should.equal(0);
      res.body.data.totalPage.should.equal(0);
      res.body.data.tab.should.equal('good');
      res.body.data.size.should.equal(10);
    } catch(err) {
      should.ifError(err.message);
    }
  });

  // 正确 - 带参数限制
  it('should / status 1', async function() {
    try {
      const res = await request.get('/v1/topics/list').query({
        tab: 'ask',
        page: 2,
        size: 1
      });

      res.body.status.should.equal(1);
      res.body.data.topics.length.should.equal(1);
      res.body.data.currentPage.should.equal(2);
      res.body.data.total.should.equal(2);
      res.body.data.totalPage.should.equal(2);
      res.body.data.tab.should.equal('ask');
      res.body.data.size.should.equal(1);
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
