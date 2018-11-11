'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _expressSession = require('express-session');

var _expressSession2 = _interopRequireDefault(_expressSession);

var _Parcel = require('../private/Parcel');

var _Parcel2 = _interopRequireDefault(_Parcel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ssn = void 0;
var router = _express2.default.Router();

router.use((0, _expressSession2.default)({
  secret: 'rwajon@sendit',
  resave: true,
  saveUninitialized: true
}));

// Fetch all parcel delivery orders
router.get('/', function (req, res, done) {
  ssn = req.session;
  /* -------------------static orders-----------------------------*/
  var staticOrders = JSON.parse(_fs2.default.readFileSync('private/parcels.json'));
  /* --------------------------------------------------------------*/
  ssn.parcels = ssn.parcels || staticOrders;
  var parcel = new _Parcel2.default(ssn.parcels);
  ssn.parcels = parcel.getAll();

  res.render('admin_all_orders', {
    title: 'Parcels | SendIT',
    path: '../',
    admin: true,
    parcels: ssn.parcels,
    error: parcel.error
  });

  done();
});

// Fetch all pending parcel delivery orders
router.get('/pending', function (req, res, done) {
  ssn = req.session;
  ssn.parcels = ssn.parcels || {};
  var parcel = new _Parcel2.default(ssn.parcels);
  var pending = parcel.getPending();

  res.render('admin_pending_orders', {
    title: 'Parcels | SendIT',
    path: '../',
    admin: true,
    parcels: pending,
    error: parcel.error
  });

  done();
});

// Fetch all parcels in transit
router.get('/in-transit', function (req, res, done) {
  ssn = req.session;
  ssn.parcels = ssn.parcels || {};
  var parcel = new _Parcel2.default(ssn.parcels);
  var inTransit = parcel.getInTransit();

  res.render('admin_parcels_in_transit', {
    title: 'Parcels | SendIT',
    path: '../',
    admin: true,
    parcels: inTransit,
    error: parcel.error
  });

  done();
});

// Fetch all delivered parcel
router.get('/delivered', function (req, res, done) {
  ssn = req.session;
  ssn.parcels = ssn.parcels || {};
  var parcel = new _Parcel2.default(ssn.parcels);
  var delivered = parcel.getDelivered();

  res.render('admin_delivered_parcels', {
    title: 'Parcels | SendIT',
    path: '../',
    admin: true,
    parcels: delivered,
    error: parcel.error
  });

  done();
});

// Fetch a specific parcel delivery oder
router.get('/:pId', function (req, res, done) {
  ssn = req.session;
  ssn.parcels = ssn.parcels || {};
  var parcel = new _Parcel2.default(ssn.parcels);
  var details = parcel.getDetails(req.params.pId);

  res.render('order_details', {
    title: 'Parcels | SendIT',
    path: '../',
    admin: true,
    parcel: details,
    error: parcel.error
  });

  done();
});

// Change a specific parcel delivery order of a specific user
router.all('/:pId/change', function (req, res, done) {
  ssn = req.session;
  ssn.parcels = ssn.parcels || {};
  var parcel = new _Parcel2.default(ssn.parcels);
  var details = parcel.getDetails(req.params.pId);

  if (req.method === 'POST') {
    var changed = parcel.changeOrder(req.params.pId, req.body);

    res.render('admin_change_order', {
      title: 'Parcels | SendIT',
      path: '../../',
      admin: true,
      parcel: changed,
      error: parcel.error,
      changed: !parcel.error
    });
  } else {
    res.render('admin_change_order', {
      title: 'Parcels | SendIT',
      path: '../../',
      admin: true,
      parcel: details,
      error: parcel.error
    });
  }

  done();
});

exports.default = router;