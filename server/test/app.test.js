const app = require('../app');
const request = require('supertest')(app);
const should = require('should');
const errorHandler = require('../middleware/error-handler');

describe('test /api', function() {
  let req;
  let res;

  before(function() {
    req = {
      params: {},
      body: {}
    };

    res = {
      data: null,
      code: null,
      status (status) {
        this.code = status;
        return this;
      },
      send (payload) {
        this.data = payload;
      }
    };
  });

  after(function() {
    req = null;
    res = null;
  });

  // 错误 - 404
  it('should / status 0 when the 404', async function() {
    try {
      const res = await request.get('/not_found');

      res.body.status.should.equal(0);
      res.body.type.should.equal('ERROR_NOT_FIND_THAT');
      res.body.message.should.equal('找不到请求资源');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  // 错误 - 500
  it('should / status 0 when 500', async function() {
    errorHandler.error500(new Error(), req, res);

    res.data.status.should.equal(0);
    res.data.type.should.equal('ERROR_SERVICE');
    res.data.message.should.equal('服务器无响应，请稍后重试');
  });

  // 正确
  it('should / status 1', async function() {
    try {
      const res = await request.get('/api');

      res.body.status.should.equal(1);
      res.body.data.should.equal('欢迎使用 Mints - 薄荷糖社区 API接口');
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
