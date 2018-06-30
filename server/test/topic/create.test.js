const app = require('../../app');
const request = require('supertest').agent(app);
const should = require('should');
const support = require('../support');

describe('test /api/create', function() {
  let mockUser;

  before(function(done) {
    support.createUser('测试', '18800000000').then(function(user) {
      mockUser = user;
      done();
    });
  });

  after(function(done) {
    support.deleteUser('18800000000').then(function() {
      mockUser = null;
      done();
    });
  });

  // 错误 - 尚未登录
  it('should return status 0 when the not signin in yet', function(done) {
    request
      .post('/api/create')
      .send({
        tab: 'ask',
        title: '测试标题',
        content: '# 哈哈哈哈哈测试内容'
      })
      .end(function(err, res) {
        should.not.exist(err);
        res.body.status.should.equal(0);
        res.body.type.should.equal('ERROR_NOT_SIGNIN');
        res.body.message.should.equal('尚未登录');
        done();
      });
  });

  // 错误 - 话题所属标签不能为空
  it('should return status 0 when the tab is empty', function(done) {
    request
      .post('/api/signin')
      .send({
        type: 'acc',
        mobile: mockUser.mobile,
        password: 'a123456'
      })
      .end(function(err, res) {
        should.not.exist(err);
        res.body.status.should.equal(1);
        res.body.data.should.have.property('id');
        res.body.data.id.should.equal(mockUser.id);
        request
          .post('/api/create')
          .send({
            title: '测试标题',
            content: '# 哈哈哈哈哈测试内容'
          })
          .end(function(err, res) {
            should.not.exist(err);
            res.body.status.should.equal(0);
            res.body.type.should.equal('ERROR_PARAMS_OF_CREATE_TOPIC');
            res.body.message.should.equal('话题所属标签不能为空');
            done();
          });
      });
  });

  // 错误 - 话题标题不能为空
  it('should return status 0 when the title is empty', function(done) {
    request
      .post('/api/signin')
      .send({
        type: 'acc',
        mobile: mockUser.mobile,
        password: 'a123456'
      })
      .end(function(err, res) {
        should.not.exist(err);
        res.body.status.should.equal(1);
        res.body.data.should.have.property('id');
        res.body.data.id.should.equal(mockUser.id);
        request
          .post('/api/create')
          .send({
            tab: 'ask',
            content: '# 哈哈哈哈哈测试内容'
          })
          .end(function(err, res) {
            should.not.exist(err);
            res.body.status.should.equal(0);
            res.body.type.should.equal('ERROR_PARAMS_OF_CREATE_TOPIC');
            res.body.message.should.equal('话题标题不能为空');
            done();
          });
      });
  });

  // 错误 - 话题内容不能为空
  it('should return status 0 when the content is empty', function(done) {
    request
      .post('/api/signin')
      .send({
        type: 'acc',
        mobile: mockUser.mobile,
        password: 'a123456'
      })
      .end(function(err, res) {
        should.not.exist(err);
        res.body.status.should.equal(1);
        res.body.data.should.have.property('id');
        res.body.data.id.should.equal(mockUser.id);
        request
          .post('/api/create')
          .send({
            tab: 'ask',
            title: '测试标题'
          })
          .end(function(err, res) {
            should.not.exist(err);
            res.body.status.should.equal(0);
            res.body.type.should.equal('ERROR_PARAMS_OF_CREATE_TOPIC');
            res.body.message.should.equal('话题内容不能为空');
            done();
          });
      });
  });

  // 正确
  it('should return status 1', function(done) {
    request
      .post('/api/signin')
      .send({
        type: 'acc',
        mobile: mockUser.mobile,
        password: 'a123456'
      })
      .end(function(err, res) {
        should.not.exist(err);
        res.body.status.should.equal(1);
        res.body.data.should.have.property('id');
        res.body.data.id.should.equal(mockUser.id);
        request
          .post('/api/create')
          .send({
            tab: 'ask',
            title: '测试标题',
            content: '# 哈哈哈哈哈测试内容'
          })
          .end(function(err, res) {
            should.not.exist(err);
            res.body.status.should.equal(1);
            done();
          });
      });
  });
});