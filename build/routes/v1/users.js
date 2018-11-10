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

var _User = require('../../private/User');

var _User2 = _interopRequireDefault(_User);

var _Parcel = require('../../private/Parcel');

var _Parcel2 = _interopRequireDefault(_Parcel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ssn = void 0;
var router = _express2.default.Router();

router.use((0, _expressSession2.default)({
  secret: 'rwajon@sendit',
  resave: true,
  saveUninitialized: true
}));

/* -------------------static users-----------------------------*/
var staticUsers = JSON.parse(_fs2.default.readFileSync('private/users.json'));
/*-----------------------------------------------------------*/
/* -------------------static orders-----------------------------*/
var staticOrders = JSON.parse(_fs2.default.readFileSync('private/parcels.json'));
/* --------------------------------------------------------------*/

// sign-in
router.get('/', function (req, res) {
  ssn = req.session;

  res.send('Please, provide a user id to check!');
});

// sign-up
router.all('/signup', function (req, res) {
  ssn = req.session;
  // ssn.users = ssn.users || {};
  ssn.users = ssn.users || staticUsers;
  var user = new _User2.default(ssn.users);

  if (req.method === 'POST') {
    var newUser = user.signup(req.body);

    if (!user.error) {
      res.send({
        newUser: newUser
      });
    }

    ssn.user = ssn.user || false;

    res.send({
      error: user.error
    });
  } else {
    res.send('Please, sign-up!');
  }
});

// sign-in
router.all('/signin', function (req, res) {
  ssn = req.session;

  if (req.method === 'POST') {
    // ssn.users = ssn.users || {};
    ssn.users = ssn.users || staticUsers;
    var user = new _User2.default(ssn.users);
    var account = user.signin(req.body);

    if (!user.error) {
      ssn.user = account;
      res.send({
        user: ssn.user
      });
    }

    ssn.user = ssn.user || false;

    res.send({
      error: user.error
    });
  } else {
    res.send({
      user: ssn.user
    });
  }
});

// Fetch a specific user information
router.get('/:id', function (req, res) {
  ssn = req.session;
  // ssn.users = ssn.users || {};
  ssn.users = ssn.users || staticUsers;
  var user = new _User2.default(ssn.users);
  var userInfo = user.getInfo(req.params.id);

  if (!user.error) {
    ssn.user = userInfo;
    res.send({
      userInfo: ssn.user
    });
  }

  res.send({
    error: user.error
  });
});

/* ----Parcel delivery order-----*/
// Fetch all parcel delivery orders of a specific user
router.get('/:id/parcels', function (req, res) {
  ssn = req.session;
  // ssn.parcels = ssn.parcels || {};
  ssn.parcels = ssn.parcels || staticOrders;
  var parcel = new _Parcel2.default(ssn.parcels);
  ssn.parcels = parcel.getAll(req.params.id);

  res.send({
    user: ssn.user,
    allParcels: ssn.parcels,
    error: parcel.error
  });
});

// Create a parcel delivery order
router.all('/:id/parcels/create', function (req, res) {
  ssn = req.session;
  // ssn.parcels = ssn.parcels || {};
  ssn.parcels = ssn.parcels || staticOrders;
  var parcel = new _Parcel2.default(ssn.parcels);

  if (req.method === 'POST') {
    var createdOrder = parcel.createOrder(req.body, staticUsers.user6781);

    if (Object.keys(createdOrder).length > 0) {
      res.send({
        createdOrder: createdOrder
      });
    }

    res.send({
      error: parcel.error
    });
  } else {
    res.send('Please, create an order!');
  }
});

// Fetch all created parcel delivery orders of a specific user
router.get('/:id/parcels/pending', function (req, res) {
  ssn = req.session;
  // ssn.parcels = ssn.parcels || {};
  ssn.parcels = ssn.parcels || staticOrders;
  var parcel = new _Parcel2.default(ssn.parcels);
  var pending = parcel.getPending(req.params.id);

  res.send({
    user: ssn.user,
    pending: pending,
    error: parcel.error
  });
});

// Fetch all parcels in transit of a specific user
router.get('/:id/parcels/in-transit', function (req, res) {
  ssn = req.session;
  // ssn.parcels = ssn.parcels || {};
  ssn.parcels = ssn.parcels || staticOrders;
  var parcel = new _Parcel2.default(ssn.parcels);
  var inTransit = parcel.getInTransit(req.params.id);

  res.send({
    user: ssn.user,
    inTransit: inTransit,
    error: parcel.error
  });
});

// Fetch all delivered parcel orders of a specific user
router.get('/:id/parcels/delivered', function (req, res) {
  ssn = req.session;
  // ssn.parcels = ssn.parcels || {};
  ssn.parcels = ssn.parcels || staticOrders;
  var parcel = new _Parcel2.default(ssn.parcels);
  var delivered = parcel.getDelivered(req.params.id);

  res.send({
    user: ssn.user,
    delivered: delivered,
    error: parcel.error
  });
});

// Fetch a specific parcel delivery oder of a specific user
router.get('/:id/parcels/:pId', function (req, res) {
  ssn = req.session;
  // ssn.parcels = ssn.parcels || {};
  ssn.parcels = ssn.parcels || staticOrders;
  var parcel = new _Parcel2.default(ssn.parcels);
  var details = parcel.getDetails(req.params.pId);

  res.send({
    user: ssn.user,
    parcelDetails: details,
    error: parcel.error
  });
});

// Change a specific parcel delivery order of a specific user
router.all('/:id/parcels/:pId/change', function (req, res) {
  ssn = req.session;
  // ssn.parcels = ssn.parcels || {};
  ssn.parcels = ssn.parcels || staticOrders;
  var parcel = new _Parcel2.default(ssn.parcels);
  var details = parcel.getDetails(req.params.pId);

  if (req.method === 'POST') {
    var changed = parcel.changeOrder(req.params.pId, req.body, staticUsers.user6781);

    res.send({
      user: ssn.user,
      changed: changed,
      error: parcel.error
    });
  } else {
    res.send({
      user: ssn.user,
      parcelDetails: details,
      error: parcel.error
    });
  }
});

// Cancel a specific parcel delivery order of a specific user
router.get('/:id/parcels/:pId/cancel', function (req, res) {
  ssn = req.session;
  ssn.parcels = ssn.parcels || staticOrders;

  if (ssn.parcels && req.params.id) {
    Object.keys(ssn.parcels).forEach(function (key) {
      if (ssn.parcels[key].orderId === req.params.pId) {
        res.send({
          cancel: ssn.parcels[key]
        });
        delete ssn.parcels[key];
        // res.redirect('back');
      }
    });
  }
});

exports.default = router;