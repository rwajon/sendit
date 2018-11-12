'use strict';

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _chaiHttp = require('chai-http');

var _chaiHttp2 = _interopRequireDefault(_chaiHttp);

var _app = require('../app');

var _app2 = _interopRequireDefault(_app);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var assert = _chai2.default.assert;
var expect = _chai2.default.expect;


_chai2.default.use(_chaiHttp2.default);

describe('index', function () {
  describe('GET api/v1', function () {
    it('it should return a status code of 200 and display \'Welcome!!!\'', function (done) {
      _chai2.default.request(_app2.default).get('/api/v1').end(function (err, res) {
        expect(res.status).to.equal(200);
        expect(res.text).to.equal('Welcome!!!');
        done();
      });
    });
  });
});