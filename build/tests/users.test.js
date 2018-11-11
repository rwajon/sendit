'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _User = require('../private/User');

var _User2 = _interopRequireDefault(_User);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var expect = _chai2.default.expect;

var users = JSON.parse(_fs2.default.readFileSync('private/users.json'));

describe('User class', function () {
  /** ****get user tests***** */
  describe('getInfo method', function () {
    // test 1
    it('should return the corresponding user information based on the given id', function () {
      var id = '001';
      var user = new _User2.default(users);

      expect(user.getInfo(id) instanceof Object).to.be.true;
    });

    // test 2
    it('should display \'Sorry, there is no user that corresponds to this id: 0000\'', function () {
      var id = '0000';
      var user = new _User2.default(users);

      user.getInfo(id);

      expect(user.error).to.equal('Sorry, there is no user that corresponds to this id: 0000');
    });

    // test 3
    it('should display \'Please, provide a user id to check!\'', function () {
      var id = null;
      var user = new _User2.default(users);

      user.getInfo(id);

      expect(user.error).to.equal('Please, provide a user id to check!');
    });
  }); // end of getInfo method tests

  /** ****signin method***** */
  describe('signin method', function () {
    // test 1
    it('should return the user information if the account exists', function () {
      var user = new _User2.default(users);

      var form = {
        uname: 'rwajon',
        password: '12345'
      };

      expect(user.signin(form) instanceof Object).to.be.true;
    });

    // test 2
    it('should display \'Sorry, your username or password is incorrect\'', function () {
      var user = new _User2.default(users);

      var form = {
        uname: 'rwajon',
        password: '1234'
      };

      user.signin(form);

      expect(user.error).to.equal('Sorry, your username or password is incorrect');
    });

    // test 3
    it('should display \'Please, enter your username and your password!\'', function () {
      var user = new _User2.default(users);

      var form = {
        uname: '',
        password: ''
      };

      user.signin(form);

      expect(user.error).to.equal('Please, enter your username and your password!');
    });

    // test 4
    it('should display \'Please, enter your username and your password!\'', function () {
      var user = new _User2.default(users);

      user.signin();

      expect(user.error).to.equal('Please, enter your username and your password!');
    });
  }); // end of signin method tests

  /** *****signup method****** */
  describe('signup method', function () {
    // test 1
    it('should return the user information if the registration has succeeded', function () {
      var user = new _User2.default(users);

      var form = {
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
      };

      expect(user.signup(form) instanceof Object).to.be.true;
    });

    // test 2
    it('should display \'Please, enter the required information to sign-up!\'', function () {
      var user = new _User2.default(users);

      var form = {
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
      };

      user.signup(form);

      expect(user.error).to.equal('Please, enter the required information to sign-up!');
    });

    // test 4
    it('should display \'Please, enter the required information to sign-up!\'', function () {
      var user = new _User2.default(users);

      user.signup();

      expect(user.error).to.equal('Please, enter the required information to sign-up!');
    });
  }); // end of signup method tests
});