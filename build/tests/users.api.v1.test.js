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
  describe('GET /api/v1/users/:id', function () {
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
    describe('GET /api/v1/users/signin', function () {
      it('should display \'Please, sign-in!\'', function (done) {
        _chai2.default.request(_app2.default).get('/api/v1/users/signin').end(function (err, res) {
          expect(res.status).to.equal(200);
          expect(res.text).to.be.equal('Please, sign-in!');
          done();
        });
      });
    });

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
    describe('GET /api/v1/users/signup', function () {
      it('should display \'Please, sign-up!\'', function (done) {
        _chai2.default.request(_app2.default).get('/api/v1/users/signup').end(function (err, res) {
          expect(res.status).to.equal(200);
          expect(res.text).to.be.equal('Please, sign-up!');
          done();
        });
      });
    });

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

  describe('GET /api/v1/users/:id/parcels', function () {
    it('should return all parcel delivery orders of the user 001', function (done) {
      _chai2.default.request(_app2.default).get('/api/v1/users/001/parcels').end(function (err, res) {
        expect(res.status).to.equal(200);
        expect(Object.keys(JSON.parse(res.text).allParcels).length).to.be.above(0);
        done();
      });
    });
  }); // end of GET /api/v1/users/:id/parcels

  describe('GET /api/v1/users/:id/parcels/:pId', function () {
    it('should return details of a specific parcel delivery order with the id: 002 of the user 001', function (done) {
      _chai2.default.request(_app2.default).get('/api/v1/users/001/parcels/002').end(function (err, res) {
        expect(res.status).to.equal(200);
        expect(Object.keys(JSON.parse(res.text).parcelDetails).length).to.be.above(0);
        done();
      });
    });
  }); // end of GET /api/v1/users/:id/parcels/:pId

  describe('GET /api/v1/users/:id/parcels/pending', function () {
    it('should return all pending parcel delivery orders of the user 001', function (done) {
      _chai2.default.request(_app2.default).get('/api/v1/users/001/parcels/pending').end(function (err, res) {
        expect(res.status).to.equal(200);
        expect(Object.keys(JSON.parse(res.text).pending).length).to.be.above(0);
        done();
      });
    });
  }); // end of GET /api/v1/users/:id/parcels/pending

  describe('GET /api/v1/users/:id/parcels/in-transit', function () {
    it('should return all parcels in transit of the user 001', function (done) {
      _chai2.default.request(_app2.default).get('/api/v1/users/001/parcels/in-transit').end(function (err, res) {
        expect(res.status).to.equal(200);
        expect(Object.keys(JSON.parse(res.text).inTransit).length).to.be.above(0);
        done();
      });
    });
  }); // end of GET /api/v1/users/:id/parcels/in-transit

  describe('GET /api/v1/users/:id/parcels/delivered', function () {
    it('should return all delivered parcels of the user 001', function (done) {
      _chai2.default.request(_app2.default).get('/api/v1/users/001/parcels/delivered').end(function (err, res) {
        expect(res.status).to.equal(200);
        expect(Object.keys(JSON.parse(res.text).delivered).length).to.be.above(0);
        done();
      });
    });
  }); // end of GET /api/v1/users/:id/parcels/delivered

  describe('GET /api/v1/users/:id/parcels/:pId/change', function () {
    it('should return the current info of the order to change', function (done) {
      _chai2.default.request(_app2.default).get('/api/v1/users/001/parcels/002/change').end(function (err, res) {
        expect(res.status).to.equal(200);
        expect(Object.keys(JSON.parse(res.text).parcelDetails).length).to.be.above(0);
        done();
      });
    });
  }); // end of GET /api/v1/users/:id/parcels/:pId/change

  describe('POST /api/v1/users/:id/parcels/:pId/change', function () {
    it('change the destination of a specific parcel delivery order with the id: 002 of the user 001', function (done) {
      _chai2.default.request(_app2.default).post('/api/v1/users/001/parcels/002/change').send({
        new_country: 'England',
        new_city: 'London',
        new_address: 'Downtown'
      }).end(function (err, res) {
        expect(res.status).to.equal(200);
        expect(Object.keys(JSON.parse(res.text).changed).length).to.be.above(0);
        done();
      });
    });
  }); // end of POST /api/v1/users/:id/parcels/:pId/change

  describe('GET /api/v1/users/:id/parcels/:pId/cancel', function () {
    it('cancel a specific parcel delivery order with the id: 003', function (done) {
      _chai2.default.request(_app2.default).get('/api/v1/users/001/parcels/003/cancel').end(function (err, res) {
        expect(res.status).to.equal(200);
        expect(Object.keys(JSON.parse(res.text).cancel).length).to.be.above(0);
        done();
      });
    });
  }); // end of GET /api/v1/users/:id/parcels/:pId/cancel

  describe('GET /api/v1/users/:id/parcels/create', function () {
    it('should display \'Please, create an order!\'', function (done) {
      _chai2.default.request(_app2.default).get('/api/v1/users/001/parcels/create').end(function (err, res) {
        expect(res.status).to.equal(200);
        expect(res.text).to.be.equal('Please, create an order!');
        done();
      });
    });
  }); // end of GET /api/v1/users/:id/parcels/create

  describe('POST /api/v1/users/:id/parcels/create', function () {
    it('create a parcel delivery order', function (done) {
      _chai2.default.request(_app2.default).post('/api/v1/users/001/parcels/create').send({
        rname: 'John Smith',
        rphone: '+123456789',
        remail: 'johnsmith@gmail.com',
        product: 'Sandals',
        weight: '1.5 Kg',
        quantity: '2',
        sender_country: 'Rwanda',
        sender_city: 'Gisenyi',
        sender_address: 'Mbugangari',
        dest_country: 'USA',
        dest_city: 'Ney-York',
        dest_address: 'Near Central Park'
      }).end(function (err, res) {
        expect(res.status).to.equal(200);
        expect(Object.keys(JSON.parse(res.text).createdOrder).length).to.be.above(0);
        done();
      });
    });
  }); // end of POST /api/v1/users/:id/parcels/create
});