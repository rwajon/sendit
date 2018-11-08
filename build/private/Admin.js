'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Admin = function () {
  function Admin(admins) {
    _classCallCheck(this, Admin);

    this.admin = {};
    this.admins = admins || {};
    this.error = '';
  }

  _createClass(Admin, [{
    key: 'signin',
    value: function signin(form) {
      var _this = this;

      if (!form) {
        this.error = 'Please, enter your username and your password!';
        return this.error;
      }

      if (Object.keys(form).length === 2 && form.uname !== '' && form.password !== '') {
        Object.keys(this.admins).forEach(function (key) {
          if (_this.admins[key].uname === form.uname && _this.admins[key].password === form.password) {
            _this.admin = _this.admins[key];
          }
        });

        if (Object.keys(this.admin).length > 0) {
          return this.admin;
        }

        this.error = 'Sorry, your username or password is incorrect';
        return this.error;
      }

      this.error = 'Please, enter your username and your password!';
      return this.error;
    } // end of signin method

  }]);

  return Admin;
}(); // end of Admin class


exports.default = Admin;