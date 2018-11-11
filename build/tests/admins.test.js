'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _Admin = require('../private/Admin');

var _Admin2 = _interopRequireDefault(_Admin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var expect = _chai2.default.expect;

var admins = JSON.parse(_fs2.default.readFileSync('private/admins.json'));

describe('Admin class', function () {
  /** ****signin method***** */
  describe('signin method', function () {
    // test 1
    it('should return the admin information if the account exists', function () {
      var admin = new _Admin2.default(admins);

      var form = {
        uname: 'rwajon',
        password: '12345'
      };

      expect(admin.signin(form) instanceof Object).to.be.true;
    });

    // test 2
    it('should display \'Sorry, your username or password is incorrect\'', function () {
      var admin = new _Admin2.default(admins);

      var form = {
        uname: 'rwajon',
        password: '1234'
      };

      admin.signin(form);

      expect(admin.error).to.equal('Sorry, your username or password is incorrect');
    });

    // test 3
    it('should display \'Please, enter your username and your password!\'', function () {
      var admin = new _Admin2.default(admins);

      var form = {
        uname: '',
        password: ''
      };

      admin.signin(form);

      expect(admin.error).to.equal('Please, enter your username and your password!');
    });
  }); // end of signin method tests
});