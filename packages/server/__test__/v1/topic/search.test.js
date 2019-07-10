const app = require('../../../app').listen();
const request = require('supertest')(app);
const should = require('should');
const support = require('../../support');

describe('test /v1/topics/search', function() {
  let mockUser;
  let mockTopic;

  before(async function() {
    mockUser = await support.createUser('123456@qq.com', '话题创建者');
    mockTopic = await support.createTopic(mockUser.id);
    await support.createTopic(mockUser.id);
  });

  after(async function() {
    await support.deleteTopic({ author_id: mockUser.id });
    await support.deleteTopic({ _id: mockTopic.id });
    await support.deleteUser(mockUser.email);
  });

  it('should / status 200 when the query is default', async function() {
    try {
      const res = await request
        .get('/v1/topics/search')
        .query({
          title: mockTopic.title
        })
        .expect(200);

      res.body.topics.length.should.equal(2);
      res.body.currentPage.should.equal(1);
      res.body.total.should.equal(2);
      res.body.totalPage.should.equal(1);
      res.body.size.should.equal(10);
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 200 when the query condition', async function() {
    try {
      const res = await request
        .get('/v1/topics/search')
        .query({
          title: mockTopic.title,
          page: 2,
          size: 1
        })
        .expect(200);

      res.body.topics.length.should.equal(1);
      res.body.currentPage.should.equal(2);
      res.body.total.should.equal(2);
      res.body.totalPage.should.equal(2);
      res.body.size.should.equal(1);
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
