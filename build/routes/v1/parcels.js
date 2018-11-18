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

var _Parcel = require('../../controllers/Parcel');

var _Parcel2 = _interopRequireDefault(_Parcel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ssn = void 0;
var router = _express2.default.Router();

router.use((0, _expressSession2.default)({
  secret: 'rwajon@sendit',
  resave: true,
  saveUninitialized: true
}));

/* -------------------static orders-----------------------------*/
var staticOrders = JSON.parse(_fs2.default.readFileSync('src/models/parcels.json'));
/* --------------------------------------------------------------*/

// Fetch all parcel delivery orders
router.get('/', function (req, res) {
  ssn = req.session;
  ssn.parcels = ssn.parcels || staticOrders;
  var parcel = new _Parcel2.default(ssn.parcels);
  ssn.parcels = parcel.getAll();

  res.send({
    allParcels: ssn.parcels,
    error: parcel.error
  });
});

// Fetch all pending parcel delivery orders
router.get('/pending', function (req, res) {
  ssn = req.session;
  // ssn.parcels = ssn.parcels || {};
  ssn.parcels = ssn.parcels || staticOrders;
  var parcel = new _Parcel2.default(ssn.parcels);
  var pending = parcel.getPending();

  res.send({
    pending: pending,
    error: parcel.error
  });
});

// Fetch all parcels in transit
router.get('/in-transit', function (req, res) {
  ssn = req.session;
  ssn.parcels = ssn.parcels || staticOrders;
  var parcel = new _Parcel2.default(ssn.parcels);
  var inTransit = parcel.getInTransit();

  res.send({
    inTransit: inTransit,
    error: parcel.error
  });
});

// Fetch all delivered parcel
router.get('/delivered', function (req, res) {
  ssn = req.session;
  ssn.parcels = ssn.parcels || staticOrders;
  var parcel = new _Parcel2.default(ssn.parcels);
  var delivered = parcel.getDelivered();

  res.send({
    delivered: delivered,
    error: parcel.error
  });
});

// Fetch a specific parcel delivery oder
router.get('/:pId', function (req, res) {
  ssn = req.session;
  ssn.parcels = ssn.parcels || staticOrders;
  var parcel = new _Parcel2.default(ssn.parcels);
  var details = parcel.getDetails(req.params.pId);

  res.send({
    parcelDetails: details,
    error: parcel.error
  });
});

// Cancel a specific parcel delivery order of a specific user
router.put('/:pId/cancel', function (req, res) {
  ssn = req.session;
  ssn.parcels = ssn.parcels || staticOrders;

  if (ssn.parcels && req.params.pId) {
    Object.keys(ssn.parcels).forEach(function (key) {
      if (ssn.parcels[key].orderId === req.params.pId) {
        delete ssn.parcels[key];
        res.send('Cancelled');
      }
    });
  }
});

// Change a specific parcel delivery order of a specific user
router.all('/:pId/change', function (req, res) {
  ssn = req.session;
  ssn.parcels = ssn.parcels || staticOrders;
  var parcel = new _Parcel2.default(ssn.parcels);
  var details = parcel.getDetails(req.params.pId);

  if (req.method === 'POST') {
    var changed = parcel.changeOrder(req.params.pId, req.body);

    res.send({
      changed: changed,
      error: parcel.error
    });
  } else {
    res.send({
      parcelDetails: details,
      error: parcel.error
    });
  }
});

exports.default = router;