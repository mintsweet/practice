const app = require('../../app');
const request = require('supertest').agent(app);
const should = require('should');
const support = require('../support');

describe('test /api/topics/list', function() {
  let mockUser;
  let mockTopic;
  let mockTopic2;

  before(function(done) {
    support.createUser('测试', '18800000000').then(user => {
      mockUser = user;
      support.createTopic(mockUser.id).then(topic => {
        mockTopic = topic;
        support.createTopic(mockUser.id).then(topic2 => {
          mockTopic2 = topic2;
          done();
        });
      });
    });
  });

  after(function(done) {
    support.deleteUser('18800000000').then(() => {
      mockUser = null;
      support.deleteTopic(mockTopic.id).then(() => {
        mockTopic = null;
        support.deleteTopic(mockTopic2.id).then(() => {
          mockTopic2 = null;
          done();
        });
      });
    });
  });

  // 正确 - 默认
  it('should return status 1 when the query is default', function(done) {
    request
      .get('/api/topics/list')
      .end(function(err, res) {
        should.not.exist(err);
        res.body.status.should.equal(1);
        res.body.data.topics.length.should.equal(2);
        res.body.data.currentPage.should.equal(1);
        res.body.data.total.should.equal(2);
        res.body.data.totalPage.should.equal(1);
        res.body.data.tab.should.equal('all');
        res.body.data.size.should.equal(10);
        done();
      });
  });

  // 正确 - 精华话题
  it('should return status 1 when the query tab is good', function(done) {
    request
      .get('/api/topics/list')
      .query({
        tab: 'good'
      })
      .end(function(err, res) {
        should.not.exist(err);
        res.body.status.should.equal(1);
        res.body.data.topics.length.should.equal(0);
        res.body.data.currentPage.should.equal(1);
        res.body.data.total.should.equal(0);
        res.body.data.totalPage.should.equal(0);
        res.body.data.tab.should.equal('good');
        res.body.data.size.should.equal(10);
        done();
      });
  });

  // 正确 - 带参数限制
  it('should return status 1 when the has query', function(done) {
    request
      .get('/api/topics/list')
      .query({
        tab: 'ask',
        page: 2,
        size: 1
      })
      .end(function(err, res) {
        should.not.exist(err);
        res.body.status.should.equal(1);
        res.body.data.topics.length.should.equal(1);
        res.body.data.currentPage.should.equal(2);
        res.body.data.total.should.equal(2);
        res.body.data.totalPage.should.equal(2);
        res.body.data.tab.should.equal('ask');
        res.body.data.size.should.equal(1);
        done();
      });
  });
});
