const app = require('../../../app').listen();
const request = require('supertest')(app);
const should = require('should');
const support = require('../../support');

describe('test /v1/topics/list', function() {
  let mockUser;

  before(async function() {
    mockUser = await support.createUser('18800000000', '话题创建者');
    await support.createTopic(mockUser.id);
    await support.createTopic(mockUser.id);
  });

  after(async function() {
    await support.deleteUser(mockUser.mobile);
    await support.deleteTopic(mockUser.id);
  });

  it('should / status 200 when the query is default', async function() {
    try {
      const res = await request.get('/v1/topics/list').expect(200);

      res.body.topics.length.should.equal(2);
      res.body.currentPage.should.equal(1);
      res.body.total.should.equal(2);
      res.body.totalPage.should.equal(1);
      res.body.tab.should.equal('all');
      res.body.size.should.equal(10);
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 200 when the query good topic', async function() {
    try {
      const res = await request.get('/v1/topics/list').query({
        tab: 'good'
      }).expect(200);

      res.body.topics.length.should.equal(0);
      res.body.currentPage.should.equal(1);
      res.body.total.should.equal(0);
      res.body.totalPage.should.equal(0);
      res.body.tab.should.equal('good');
      res.body.size.should.equal(10);
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 200 when the query condition', async function() {
    try {
      const res = await request.get('/v1/topics/list').query({
        tab: 'ask',
        page: 2,
        size: 1
      }).expect(200);

      res.body.topics.length.should.equal(1);
      res.body.currentPage.should.equal(2);
      res.body.total.should.equal(2);
      res.body.totalPage.should.equal(2);
      res.body.tab.should.equal('ask');
      res.body.size.should.equal(1);
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
