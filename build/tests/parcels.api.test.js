'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _chaiHttp = require('chai-http');

var _chaiHttp2 = _interopRequireDefault(_chaiHttp);

var _app = require('../app');

var _app2 = _interopRequireDefault(_app);

var _Parcel = require('../private/Parcel');

var _Parcel2 = _interopRequireDefault(_Parcel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var assert = _chai2.default.assert;
var expect = _chai2.default.expect;

var parcels = JSON.parse(_fs2.default.readFileSync('private/parcels.json'));

_chai2.default.use(_chaiHttp2.default);

describe('Parcel', function () {
  describe('GET /parcels', function () {
    it('should return all parcel delivery orders', function (done) {
      _chai2.default.request(_app2.default).get('/parcels').end(function (err, res) {
        expect(res.status).to.equal(200);
        // expect(Object.keys(JSON.parse(res.text).allParcels).length).to.be.above(0);
        done();
      });
    });
  }); // end of GET /parcels

  describe('GET /parcels/:pId', function () {
    it('should return details of a specific parcel delivery order with the id: 002', function (done) {
      _chai2.default.request(_app2.default).get('/parcels/002').end(function (err, res) {
        expect(res.status).to.equal(200);
        // expect(Object.keys(JSON.parse(res.text).parcelDetails).length).to.be.above(0);
        done();
      });
    });
  }); // end of GET /parcels/:pId

  describe('GET /parcels/pending', function () {
    it('should return all pending parcel delivery orders', function (done) {
      _chai2.default.request(_app2.default).get('/parcels/pending').end(function (err, res) {
        expect(res.status).to.equal(200);
        // expect(Object.keys(JSON.parse(res.text).pending).length).to.be.above(0);
        done();
      });
    });
  }); // end of GET /parcels/pending

  describe('GET /parcels/in-transit', function () {
    it('should return all parcels in transit', function (done) {
      _chai2.default.request(_app2.default).get('/parcels/in-transit').end(function (err, res) {
        expect(res.status).to.equal(200);
        // expect(Object.keys(JSON.parse(res.text).inTransit).length).to.be.above(0);
        done();
      });
    });
  }); // end of GET /parcels/in-transit

  describe('GET /parcels/delivered', function () {
    it('should return all delivered parcels', function (done) {
      _chai2.default.request(_app2.default).get('/parcels/delivered').end(function (err, res) {
        expect(res.status).to.equal(200);
        // expect(Object.keys(JSON.parse(res.text).delivered).length).to.be.above(0);
        done();
      });
    });
  }); // end of GET /parcels/delivered

  describe('POST /parcels/:pId/change', function () {
    it('change the status and present location of a specific parcel delivery order with the id: 002', function (done) {
      _chai2.default.request(_app2.default).post('/parcels/002/change').send({
        new_status: 'In transit',
        new_country: 'Uganda',
        new_city: 'Kampala',
        new_address: ''
      }).end(function (err, res) {
        expect(res.status).to.equal(200);
        // expect(Object.keys(JSON.parse(res.text).changed).length).to.be.above(0);
        done();
      });
    });
  }); // end of POST /parcels/:pId/change

  describe('GET /users/:id/parcels', function () {
    it('should return all parcel delivery orders of the user 001', function (done) {
      _chai2.default.request(_app2.default).get('/users/001/parcels').end(function (err, res) {
        expect(res.status).to.equal(200);
        // expect(Object.keys(JSON.parse(res.text).allParcels).length).to.be.above(0);
        done();
      });
    });
  }); // end of GET /users/:id/parcels

  describe('GET /users/:id/parcels/count', function () {
    it('should return all parcel delivery orders of the user 001', function (done) {
      _chai2.default.request(_app2.default).get('/users/001/parcels/count').end(function (err, res) {
        expect(res.status).to.equal(200);
        // expect(Object.keys(JSON.parse(res.text).allParcels).length).to.be.above(0);
        done();
      });
    });
  }); // end of GET /users/:id/parcels/count

  describe('GET /users/:id/parcels/:pId', function () {
    it('should return details of a specific parcel delivery order with the id: 002 of the user 001', function (done) {
      _chai2.default.request(_app2.default).get('/users/001/parcels/002').end(function (err, res) {
        expect(res.status).to.equal(200);
        // expect(Object.keys(JSON.parse(res.text).parcelDetails).length).to.be.above(0);
        done();
      });
    });
  }); // end of GET /users/:id/parcels/:pId

  describe('GET /users/:id/parcels/pending', function () {
    it('should return all pending parcel delivery orders of the user 001', function (done) {
      _chai2.default.request(_app2.default).get('/users/001/parcels/pending').end(function (err, res) {
        expect(res.status).to.equal(200);
        // expect(Object.keys(JSON.parse(res.text).pending).length).to.be.above(0);
        done();
      });
    });
  }); // end of GET /users/:id/parcels/pending

  describe('GET /users/:id/parcels/in-transit', function () {
    it('should return all parcels in transit of the user 001', function (done) {
      _chai2.default.request(_app2.default).get('/users/001/parcels/in-transit').end(function (err, res) {
        expect(res.status).to.equal(200);
        // expect(Object.keys(JSON.parse(res.text).inTransit).length).to.be.above(0);
        done();
      });
    });
  }); // end of GET /users/:id/parcels/in-transit

  describe('GET /users/:id/parcels/delivered', function () {
    it('should return all delivered parcels of the user 001', function (done) {
      _chai2.default.request(_app2.default).get('/users/001/parcels/delivered').end(function (err, res) {
        expect(res.status).to.equal(200);
        // expect(Object.keys(JSON.parse(res.text).delivered).length).to.be.above(0);
        done();
      });
    });
  }); // end of GET /users/:id/parcels/delivered

  describe('POST /users/:id/parcels/:pId/change', function () {
    it('should not change the order if the user is not signed in', function (done) {
      _chai2.default.request(_app2.default).post('/users/001/parcels/002/change').send({
        new_country: 'England',
        new_city: 'London',
        new_address: 'Downtown'
      }).end(function (err, res) {
        expect(res.status).to.equal(500);
        // expect(Object.keys(JSON.parse(res.text).changed).length).to.be.above(0);
        done();
      });
    });
  }); // end of POST /users/:id/parcels/:pId/change

  describe('GET /users/:id/parcels/:pId/cancel', function () {
    it('cancel a specific parcel delivery order with the id: 003', function (done) {
      _chai2.default.request(_app2.default).get('/users/001/parcels/003/cancel').end(function (err, res) {
        expect(res.status).to.equal(200);
        // expect(Object.keys(JSON.parse(res.text).cancel).length).to.be.above(0);
        done();
      });
    });
  }); // end of GET /users/:id/parcels/:pId/cancel

  describe('POST /users/:id/parcels/create', function () {
    it('create a parcel delivery order', function (done) {
      _chai2.default.request(_app2.default).post('/users/001/parcels/create').send({
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
        // expect(Object.keys(JSON.parse(res.text).createdOrder).length).to.be.above(0);
        done();
      });
    });
  }); // end of POST /users/:id/parcels/create
});