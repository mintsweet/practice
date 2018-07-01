const app = require('../../app');
const request = require('supertest').agent(app);
const should = require('should');
const support = require('../support');

describe('test /api/topic/:uid/edit', function() {
  let mockUser;
  let mockUser2;
  let mockTopic;

  before(function(done) {
    support.createUser('测试', '18800000000').then(user => {
      mockUser = user;
      support.createUser('测试2', '18800000001').then(user2 => {
        mockUser2 = user2;
        support.createTopic(mockUser.id).then(topic => {
          mockTopic = topic;
          done();
        });
      });
    });
  });

  after(function(done) {
    support.deleteTopic(mockUser.id).then(() => {
      mockTopic = null;
      support.deleteUser(mockUser.id).then(() => {
        mockUser = null;
        support.deleteUser(mockUser2.id).then(() => {
          mockUser2 = null;
          done();
        });
      });
    });
  });

  // 错误 - 尚未登录
  it('should return status 0 when the not signin in yet', function(done) {
    request
      .put(`/api/topic/${mockTopic.id}/edit`)
      .send({
        tab: 'share',
        title: '改名为分享类',
        content: '# 随便改点内容'
      })
      .end(function(err, res) {
        should.not.exist(err);
        res.body.status.should.equal(0);
        res.body.type.should.equal('ERROR_NOT_SIGNIN');
        res.body.message.should.equal('尚未登录');
        done();
      });
  });

  // 错误 - 无法编辑不属于自己的话题
  it('should return status 0 when the topic is not belong to  yours', function(done) {
    request
      .post('/api/signin')
      .send({
        mobile: mockUser2.mobile,
        password: 'a123456'
      })
      .end(function(err, res) {
        should.not.exist(err);
        res.body.status.should.equal(1);
        res.body.data.should.have.property('id');
        res.body.data.id.should.equal(mockUser2.id);
        request
          .put(`/api/topic/${mockTopic.id}/edit`)
          .send({
            tab: 'share',
            title: '改名为分享类',
            content: '# 随便改点内容'
          })
          .end(function(err, res) {
            should.not.exist(err);
            res.body.status.should.equal(0);
            res.body.type.should.equal('ERROR_TOPIC_NOT_YOURS');
            res.body.message.should.equal('无法编辑不属于自己的话题');
            done();
          });
      });
  });

  // 正确
  it('should return status 1', function(done) {
    request
      .post('/api/signin')
      .send({
        mobile: mockUser.mobile,
        password: 'a123456'
      })
      .end(function(err, res) {
        should.not.exist(err);
        res.body.status.should.equal(1);
        res.body.data.should.have.property('id');
        res.body.data.id.should.equal(mockUser.id);
        request
          .put(`/api/topic/${mockTopic.id}/edit`)
          .send({
            tab: 'share',
            title: '改名为分享类',
            content: '# 随便改点内容'
          })
          .end(function(err, res) {
            should.not.exist(err);
            res.body.status.should.equal(1);
            done();
          });
      });
  });
});
