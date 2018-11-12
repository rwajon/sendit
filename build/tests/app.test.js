'use strict';

var _httpErrors = require('http-errors');

var _httpErrors2 = _interopRequireDefault(_httpErrors);

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

describe('app.js', function () {
	it('it should catch 404 and forward to error handler', function (done) {
		_chai2.default.request(_app2.default).end(function (err, res, next) {
			expect(next((0, _httpErrors2.default)(404))).to.be.true;
			done();
		});
	});
});