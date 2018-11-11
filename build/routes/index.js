'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _expressSession = require('express-session');

var _expressSession2 = _interopRequireDefault(_expressSession);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ssn = void 0;
var router = _express2.default.Router();

router.use((0, _expressSession2.default)({
  secret: 'rwajon@sendit',
  resave: true,
  saveUninitialized: true
}));

/* GET home page. */
router.get('/', function (req, res, done) {
  ssn = req.session;

  res.render('index', {
    title: 'Home | SendIT',
    path: '',
    user: ssn.user ? ssn.user : null
  });

  done();
});

exports.default = router;