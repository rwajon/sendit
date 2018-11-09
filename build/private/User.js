'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var User = function () {
  function User(users) {
    _classCallCheck(this, User);

    this.user = {};
    this.users = users || {};
    this.error = '';
  }

  _createClass(User, [{
    key: 'getInfo',
    value: function getInfo(id) {
      var _this = this;

      if (!id) {
        this.error = 'Please, provide a user id to check!';
        return {};
      }

      Object.keys(this.users).forEach(function (key) {
        if (_this.users[key].id === id) {
          _this.user = _this.users[key];
        }
      });

      if (Object.keys(this.user).length > 0) {
        return this.user;
      }

      this.error = 'Sorry, there is no user that corresponds to this id: ' + id;
      return {};
    } // end of get method

  }, {
    key: 'signup',
    value: function signup(form) {
      if (!form) {
        this.error = 'Please, enter the required information to sign-up!';
        return {};
      }

      if (form.fname && form.lname && form.uname && form.password && form.phone && form.country) {
        var id = Math.random().toString().substr(2, 3);

        this.user = {
          id: id,
          fname: form.fname,
          lname: form.lname,
          uname: form.uname,
          password: form.password,
          phone: form.phone,
          email: form.email,
          country: form.country,
          city: form.city,
          address: form.address
        };

        this.users['user' + id] = this.user;

        return this.user;
      }

      this.error = 'Please, enter the required information to sign-up!';
      return {};
    } // end of signup method

  }, {
    key: 'signin',
    value: function signin(form) {
      var _this2 = this;

      if (!form) {
        this.error = 'Please, enter your username and your password!';
        return {};
      }

      if (Object.keys(form).length === 2 && form.uname !== '' && form.password !== '') {
        Object.keys(this.users).forEach(function (key) {
          if (_this2.users[key].uname === form.uname && _this2.users[key].password === form.password) {
            _this2.user = _this2.users[key];
          }
        });

        if (Object.keys(this.user).length > 0) {
          return this.user;
        }

        this.error = 'Sorry, your username or password is incorrect';
        return {};
      }

      this.error = 'Please, enter your username and your password!';
      return {};
    } // end of signin method

  }]);

  return User;
}(); // end of User class


exports.default = User;