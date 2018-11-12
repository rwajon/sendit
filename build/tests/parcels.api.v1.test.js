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

var parcels = JSON.parse(_fs2.default.readFileSync('private/parcels.json'));

_chai2.default.use(_chaiHttp2.default);

describe('Parcel', function () {
  describe('GET /api/v1/parcels', function () {
    it('should return all parcel delivery orders', function (done) {
      _chai2.default.request(_app2.default).get('/api/v1/parcels').end(function (err, res) {
        expect(res.status).to.equal(200);
        expect(Object.keys(JSON.parse(res.text).allParcels).length).to.be.above(0);
        done();
      });
    });
  }); // end of GET /api/v1/parcels

  describe('GET /api/v1/parcels/pending', function () {
    it('should return all pending parcel delivery orders', function (done) {
      _chai2.default.request(_app2.default).get('/api/v1/parcels/pending').end(function (err, res) {
        expect(res.status).to.equal(200);
        expect(Object.keys(JSON.parse(res.text).pending).length).to.be.above(0);
        done();
      });
    });
  }); // end of GET /api/v1/parcels/pending

  describe('GET /api/v1/parcels/in-transit', function () {
    it('should return all parcels in transit', function (done) {
      _chai2.default.request(_app2.default).get('/api/v1/parcels/in-transit').end(function (err, res) {
        expect(res.status).to.equal(200);
        expect(Object.keys(JSON.parse(res.text).inTransit).length).to.be.above(0);
        done();
      });
    });
  }); // end of GET /api/v1/parcels/in-transit

  describe('GET /api/v1/parcels/delivered', function () {
    it('should return all delivered parcels', function (done) {
      _chai2.default.request(_app2.default).get('/api/v1/parcels/delivered').end(function (err, res) {
        expect(res.status).to.equal(200);
        expect(Object.keys(JSON.parse(res.text).delivered).length).to.be.above(0);
        done();
      });
    });
  }); // end of GET /api/v1/parcels/delivered

  describe('GET /api/v1/parcels/:pId', function () {
    it('should return details of a specific parcel delivery order with the id: 002', function (done) {
      _chai2.default.request(_app2.default).get('/api/v1/parcels/002').end(function (err, res) {
        expect(res.status).to.equal(200);
        expect(Object.keys(JSON.parse(res.text).parcelDetails).length).to.be.above(0);
        done();
      });
    });
  }); // end of GET /api/v1/parcels/:pId

  describe('GET /api/v1/parcels/:pId/change', function () {
    it('should return the current info of the order to change', function (done) {
      _chai2.default.request(_app2.default).get('/api/v1/parcels/002/change').end(function (err, res) {
        expect(res.status).to.equal(200);
        expect(Object.keys(JSON.parse(res.text).parcelDetails).length).to.be.above(0);
        done();
      });
    });
  }); // end of GET /api/v1/parcels/:pId/change

  describe('POST /api/v1/parcels/:pId/change', function () {
    it('change the status and present location of a specific parcel delivery order with the id: 002', function (done) {
      _chai2.default.request(_app2.default).post('/api/v1/parcels/002/change').send({
        new_status: 'In transit',
        new_country: 'Uganda',
        new_city: 'Kampala',
        new_address: ''
      }).end(function (err, res) {
        expect(res.status).to.equal(200);
        expect(Object.keys(JSON.parse(res.text).changed).length).to.be.above(0);
        done();
      });
    });
  }); // end of POST /api/v1/parcels/:pId/change
});