'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _chaiHttp = require('chai-http');

var _chaiHttp2 = _interopRequireDefault(_chaiHttp);

var _app = require('../app');

var _app2 = _interopRequireDefault(_app);

var _User = require('../private/User');

var _User2 = _interopRequireDefault(_User);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var assert = _chai2.default.assert;
var expect = _chai2.default.expect;

var users = JSON.parse(_fs2.default.readFileSync('private/users.json'));

_chai2.default.use(_chaiHttp2.default);

describe('User', function () {
  describe('GET /api/v1/users', function () {
    it('should display \'Please, sign-in!\'', function (done) {
      _chai2.default.request(_app2.default).get('/api/v1/users').end(function (err, res) {
        expect(res.status).to.equal(200);
        expect(res.text).to.equal('Please, provide a user id to check!');
        done();
      });
    });
  });

  // get user info
  describe('GET /api/v1/users/0000', function () {
    it('should return the info of a specific user with the id: 001', function (done) {
      _chai2.default.request(_app2.default).get('/api/v1/users/001').end(function (err, res) {
        expect(res.status).to.equal(200);
        expect(Object.keys(JSON.parse(res.text).userInfo).length).to.be.above(0);
        done();
      });
    });

    it('should display \'Sorry, there is no user that corresponds to this id: 0000\'', function (done) {
      _chai2.default.request(_app2.default).get('/api/v1/users/0000').end(function (err, res) {
        expect(res.status).to.equal(200);
        expect(JSON.parse(res.text).error).to.equal('Sorry, there is no user that corresponds to this id: 0000');
        done();
      });
    });
  });

  /* Sign-in */
  describe('Sign-in', function () {
    describe('POST /api/v1/users/signin', function () {
      // test 1
      it('should return the user information if the account exists', function (done) {
        _chai2.default.request(_app2.default).post('/api/v1/users/signin').send({
          uname: 'rwajon',
          password: '12345'
        }).end(function (err, res) {
          expect(res.status).to.equal(200);
          expect(Object.keys(JSON.parse(res.text).user).length).to.be.above(0);
          done();
        });
      });

      // test 2
      it('should display \'Sorry, your username or password is incorrect\'', function (done) {
        _chai2.default.request(_app2.default).post('/api/v1/users/signin').send({
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
        _chai2.default.request(_app2.default).post('/api/v1/users/signin').send({
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

  /* Sign-up */
  describe('Sign-up', function () {
    describe('POST /api/v1/users/signup', function () {
      // test 1
      it('should return the user information if the registration has succeeded', function (done) {
        _chai2.default.request(_app2.default).post('/api/v1/users/signup').send({
          id: '001',
          fname: 'Jonathan',
          lname: 'Rwabahizi',
          uname: 'rwajon',
          password: '12345',
          phone: '+250781146646',
          email: 'jonathanrwabahizi@gmail.com',
          country: 'Rwanda',
          city: 'Gisenyi',
          address: 'Mbugangari'
        }).end(function (err, res) {
          expect(res.status).to.equal(200);
          expect(Object.keys(JSON.parse(res.text).newUser).length).to.be.above(0);
          done();
        });
      });

      // test 2
      it('should display \'Please, enter the required information to sign-up!\'', function (done) {
        _chai2.default.request(_app2.default).post('/api/v1/users/signup').send({
          id: '001',
          fname: 'Jonathan',
          lname: '',
          uname: 'rwajon',
          password: '',
          phone: '+250781146646',
          email: 'jonathanrwabahizi@gmail.com',
          country: 'Rwanda',
          city: 'Gisenyi',
          address: 'Mbugangari'
        }).end(function (err, res) {
          expect(res.status).to.equal(200);
          expect(JSON.parse(res.text).error).to.equal('Please, enter the required information to sign-up!');
          done();
        });
      });
    });
  }); // end of Sign-up
});