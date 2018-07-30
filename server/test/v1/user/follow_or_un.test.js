const app = require('../../../app').listen();
const request = require('supertest')(app);
const should = require('should');
const support = require('../../support');

describe('test /v1/user/:rid/follow_or_un', function() {
  let mockUser;
  let mockUser2;

  before(async function() {
    mockUser = await support.createUser('18800000000', '被关注着');
    mockUser2 = await support.createUser('18800000001', '关注者');
  });

  after(async function() {
    await support.deleteNotice(mockUser.id);
    await support.deleteAction(mockUser2.id);
    await support.deleteUser(mockUser.mobile);
    await support.deleteUser(mockUser2.mobile);
  });

  it('should / status 401 when the not signin', async function() {
    try {
      await request.patch(`/v1/user/${mockUser2.id}/follow_or_un`).expect(401);
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 200 when the action is follow', async function() {
    try {
      let res = await request.post('/v1/signin').send({
        mobile: mockUser2.mobile,
        password: 'a123456'
      }).expect(200);

      res = await request.patch(`/v1/user/${mockUser.id}/follow_or_un`).set('Authorization', res.text).expect(200);

      res.text.should.equal('follow');
    } catch(err) {
      should.ifError(err.message);
    }
  });

  it('should / status 200 when the action is un_follow', async function() {
    try {
      let res = await request.post('/v1/signin').send({
        mobile: mockUser2.mobile,
        password: 'a123456'
      }).expect(200);

      res = await request.patch(`/v1/user/${mockUser.id}/follow_or_un`).set('Authorization', res.text).expect(200);

      res.text.should.equal('un_follow');
    } catch(err) {
      should.ifError(err.message);
    }
  });
});
