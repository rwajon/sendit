'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import session from 'express-session';

// let ssn;
var router = _express2.default.Router();

/* router.use(session({
  secret: 'rwajon@sendit',
  resave: true,
  saveUninitialized: true,
})); */

/* GET home page. */
router.get('/', function (req, res) {
  // ssn = req.session;

  res.send('Welcome!!!');
});

exports.default = router;