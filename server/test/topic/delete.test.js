const app = require('../../app');
const request = require('supertest').agent(app);
const should = require('should');
const support = require('../support');

describe('test /api/topic/:tid/delete', function() {
  let mockUser;
  let mockUser2;
  let mockTopic;
  
  before(function(done) {
    support.createUser('测试', '18800000000').then(user => {
      mockUser = user;
      support.createUser('测试2', '18800000001').then(user2 => {
        mockUser2 = user2;
        support.createTopic(user.id).then(topic => {
          mockTopic = topic;
          done();
        });
      });
    })
  });

  after(function(done) {
    support.deleteUser('18800000000').then(() => {
      mockUser = null;
      support.deleteUser('18800000001').then(() => {
        mockUser2 = null;
        support.deleteTopic().then(() => {
          mockTopic = null;
          done();
        });
      });
    });
  });

  // 错误 - 尚未登录
  it('should return status 0 when the not signin in yet', function(done) {
    request
      .delete(`/api/topic/${mockTopic.id}/delete`)
      .end(function(err, res) {
        should.not.exist(err);
        res.body.status.should.equal(0);
        res.body.type.should.equal('ERROR_NOT_SIGNIN');
        res.body.message.should.equal('尚未登录');
        done();
      });
  });

  // 错误 - 无效的话题ID
  it('should return status 0 when the tid is invalid', function(done) {
    request
      .post('/api/signin')
      .send({
        mobile: '18800000000',
        password: 'a123456'        
      })
      .end(function(err, res) {
        should.not.exist(err);
        res.body.status.should.equal(1);
        res.body.data.should.have.property('id');
        res.body.data.id.should.equal(mockUser.id);
        request
          .delete(`/api/topic/${require('mongoose').Types.ObjectId()}/delete`)
          .end(function(err, res) {
            should.not.exist(err);
            res.body.status.should.equal(0);
            res.body.type.should.equal('ERROR_INVALID_TOPIC_ID');
            res.body.message.should.equal('无效的话题ID');
            done();
          });
      });
  });

  // 错误 - 无法删除不属于自己的话题
  it('should return status 0 when the topic is not belong to you', function(done) {
    request
      .post('/api/signin')
      .send({
        mobile: '18800000001',
        password: 'a123456'
      })
      .end(function(err, res) {
        should.not.exist(err);
        res.body.status.should.equal(1);
        res.body.data.should.have.property('id');
        res.body.data.id.should.equal(mockUser2.id);
        request
          .delete(`/api/topic/${mockTopic.id}/delete`)
          .end(function(err, res) {
            should.not.exist(err);
            res.body.status.should.equal(0);
            res.body.type.should.equal('ERROR_TOPIC_NOT_YOURS');
            res.body.message.should.equal('无法删除不属于自己的话题');
            done();
          });
      });
  });

  // 正确
  it('should return status 1', function(done) {
    request
      .post('/api/signin')
      .send({
        mobile: '18800000000',
        password: 'a123456'        
      })
      .end(function(err, res) {
        should.not.exist(err);
        res.body.status.should.equal(1);
        res.body.data.should.have.property('id');
        res.body.data.id.should.equal(mockUser.id);
        request
          .delete(`/api/topic/${mockTopic.id}/delete`)
          .end(function(err, res) {
            should.not.exist(err);
            res.body.status.should.equal(1);
            done();
          });
      });
  });
});