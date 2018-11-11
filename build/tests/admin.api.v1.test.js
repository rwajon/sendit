'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _chaiHttp = require('chai-http');

var _chaiHttp2 = _interopRequireDefault(_chaiHttp);

var _app = require('../app');

var _app2 = _interopRequireDefault(_app);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var assert = _chai2.default.assert;
var expect = _chai2.default.expect;

var admins = JSON.parse(_fs2.default.readFileSync('private/admins.json'));

_chai2.default.use(_chaiHttp2.default);

describe('Admin', function () {
  /* Sign-in */
  describe('Sign-in', function () {
    describe('GET /api/v1/admins', function () {
      it('should display \'Welcome admin!!!\' if the admin successfully signed in', function (done) {
        _chai2.default.request(_app2.default).get('/api/v1/admins').end(function (err, res) {
          expect(res.status).to.equal(200);
          expect(res.text).to.be.equal('Welcome admin!!!');
          done();
        });
      });
    });

    describe('GET /api/v1/admins/signin', function () {
      it('should display \'Please, sign-in!\'', function (done) {
        _chai2.default.request(_app2.default).get('/api/v1/admins/signin').end(function (err, res) {
          expect(res.status).to.equal(200);
          expect(res.text).to.be.equal('Please, sign-in!');
          done();
        });
      });
    });

    describe('POST /api/v1/admins/signin', function () {
      // test 1
      it('should return the admin information if the account exists', function (done) {
        _chai2.default.request(_app2.default).post('/api/v1/admins/signin').send({
          uname: 'rwajon',
          password: '12345'
        }).end(function (err, res) {
          expect(res.status).to.equal(200);
          expect(Object.keys(JSON.parse(res.text).admin).length).to.be.above(0);
          done();
        });
      });

      // test 2
      it('should display \'Sorry, your username or password is incorrect\'', function (done) {
        _chai2.default.request(_app2.default).post('/api/v1/admins/signin').send({
          uname: 'rwajon',
          password: '1234'
        }).end(function (err, res) {
          expect(res.status).to.equal(200);
          expect(JSON.parse(res.text).error).to.equal('Sorry, your username or password is incorrect');
          done();
        });
      });

      // test 3
      it('should display \'Please, enter your username and your password!\'', function (done) {
        _chai2.default.request(_app2.default).post('/api/v1/admins/signin').send({
          uname: '',
          password: ''
        }).end(function (err, res) {
          expect(res.status).to.equal(200);
          expect(JSON.parse(res.text).error).to.equal('Please, enter your username and your password!');
          done();
        });
      });
    });
  }); // end of Sign-in
});