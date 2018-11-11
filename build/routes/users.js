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

var _User = require('../private/User');

var _User2 = _interopRequireDefault(_User);

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

// sign-in
router.get('/', function (req, res) {
  ssn = req.session;

  res.render('signin', {
    title: 'Users | SendIT',
    path: '../',
    user: ssn.user || false
  });
});

// sign-out
router.get('/signout', function (req, res) {
  req.session.destroy(function () {
    res.redirect('/users/signin');
  });
});

// sign-up
router.all('/signup', function (req, res) {
  ssn = req.session;
  ssn.users = ssn.users || {};
  var user = new _User2.default(ssn.users);

  if (req.method === 'POST') {
    var newUser = user.signup(req.body);

    if (!user.error) {
      res.redirect('/users/' + newUser.id);
    }

    ssn.user = ssn.user || false;

    res.render('signup', {
      title: 'Sign-up | SendIT',
      path: '../',
      user: ssn.user,
      error: user.user
    });
  } else {
    res.render('signup', {
      title: 'Sign-up | SendIT',
      path: '../',
      user: ssn.user || false
    });
  }
});

// sign-in
router.all('/signin', function (req, res) {
  ssn = req.session;

  if (req.method === 'POST') {
    /* -------------------static users-----------------------------*/
    var staticUsers = JSON.parse(_fs2.default.readFileSync('private/users.json'));
    /*-----------------------------------------------------------*/
    ssn.users = ssn.users || staticUsers;
    var user = new _User2.default(ssn.users);
    var account = user.signin(req.body);

    if (!user.error) {
      ssn.user = account;
      res.redirect('/users/' + ssn.user.id);
    }

    ssn.user = ssn.user || false;

    res.render('signin', {
      title: 'Sign-in | SendIT',
      path: '../',
      user: ssn.user,
      error: user.error
    });
  } else {
    res.render('signin', {
      title: 'Sign-in | SendIT',
      path: '../',
      user: ssn.user || false
    });
  }
});

// Fetch a specific user information
router.get('/:id', function (req, res) {
  ssn = req.session;
  ssn.users = ssn.users || {};
  var user = new _User2.default(ssn.users);
  var userInfo = user.getInfo(req.params.id);

  if (!user.error) {
    ssn.user = userInfo;
  }

  res.render('users', {
    title: 'Users | SendIT',
    path: '../',
    user: ssn.user || false,
    error: user.error
  });
});

/* ----Parcel delivery order-----*/
// Count all parcel delivery orders of a specific user
router.get('/parcels/count', function (req, res) {
  ssn = req.session;

  if (ssn.user) {
    var pending = 0;
    var inTransit = 0;
    var delivered = 0;

    Object.keys(ssn.parcels).forEach(function (key) {
      if (ssn.parcels[key].status === 'Pending') {
        pending += 1;
      }
      if (ssn.parcels[key].status === 'In transit') {
        inTransit += 1;
      }
      if (ssn.parcels[key].status === 'Delivered') {
        delivered += 1;
      }
    });

    var parcels = {
      pending: pending,
      inTransit: inTransit,
      delivered: delivered
    };

    res.send(parcels);
  } else {
    res.send(false);
  }
});

// Fetch all parcel delivery orders of a specific user
router.get('/:id/parcels', function (req, res) {
  ssn = req.session;
  /* -------------------static orders-----------------------------*/
  var staticOrders = JSON.parse(_fs2.default.readFileSync('private/parcels.json'));
  /* --------------------------------------------------------------*/
  ssn.parcels = ssn.parcels || staticOrders;
  var parcel = new _Parcel2.default(ssn.parcels);
  ssn.parcels = parcel.getAll(req.params.id);

  res.render('all_orders', {
    title: 'Parcels | SendIT',
    path: '../../',
    user: ssn.user || false,
    parcels: ssn.parcels,
    error: parcel.error
  });
});

// Create a parcel delivery order
router.all('/:id/parcels/create', function (req, res) {
  ssn = req.session;
  ssn.parcels = ssn.parcels || {};
  var parcel = new _Parcel2.default(ssn.parcels);

  if (req.method === 'POST') {
    var createdOrder = parcel.createOrder(req.body, ssn.user);

    if (Object.keys(createdOrder).length > 0) {
      res.redirect('/users/' + ssn.user.id + '/parcels/' + createdOrder.orderId);
    }

    res.render('create_order', {
      title: 'Parcels | SendIT',
      path: '../../../',
      user: ssn.user || false,
      error: parcel.error
    });
  } else {
    res.render('create_order', {
      title: 'Parcels | SendIT',
      path: '../../../',
      user: ssn.user || false
    });
  }
});

// Fetch all created parcel delivery orders of a specific user
router.get('/:id/parcels/pending', function (req, res) {
  ssn = req.session;
  ssn.parcels = ssn.parcels || {};
  var parcel = new _Parcel2.default(ssn.parcels);
  var pending = parcel.getPending(req.params.id);

  res.render('pending_orders', {
    title: 'Parcels | SendIT',
    path: '../../../',
    user: ssn.user || false,
    parcels: pending,
    error: parcel.error
  });
});

// Fetch all parcels in transit of a specific user
router.get('/:id/parcels/in-transit', function (req, res) {
  ssn = req.session;
  ssn.parcels = ssn.parcels || {};
  var parcel = new _Parcel2.default(ssn.parcels);
  var inTransit = parcel.getInTransit(req.params.id);

  res.render('parcels_in_transit', {
    title: 'Parcels | SendIT',
    path: '../../../',
    user: ssn.user || false,
    parcels: inTransit,
    error: parcel.error
  });
});

// Fetch all delivered parcel orders of a specific user
router.get('/:id/parcels/delivered', function (req, res) {
  ssn = req.session;
  ssn.parcels = ssn.parcels || {};
  var parcel = new _Parcel2.default(ssn.parcels);
  var delivered = parcel.getDelivered(req.params.id);

  res.render('delivered_parcels', {
    title: 'Parcels | SendIT',
    path: '../../../',
    user: ssn.user || false,
    parcels: delivered,
    error: parcel.error
  });
});

// Fetch a specific parcel delivery oder of a specific user
router.get('/:id/parcels/:pId', function (req, res) {
  ssn = req.session;
  ssn.parcels = ssn.parcels || {};
  var parcel = new _Parcel2.default(ssn.parcels);
  var details = parcel.getDetails(req.params.pId);

  res.render('order_details', {
    title: 'Parcels | SendIT',
    path: '../../../',
    user: ssn.user || false,
    parcel: details,
    error: parcel.error
  });
});

// Cancel a specific parcel delivery order of a specific user
router.get('/:id/parcels/:pId/cancel', function (req, res) {
  ssn = req.session;

  if (ssn.parcels && req.params.id) {
    Object.keys(ssn.parcels).forEach(function (key) {
      if (ssn.parcels[key].orderId === req.params.pId) {
        delete ssn.parcels[key];
        res.redirect('back');
      }
    });
  }
});

// Change a specific parcel delivery order of a specific user
router.all('/:id/parcels/:pId/change', function (req, res) {
  ssn = req.session;
  ssn.parcels = ssn.parcels || {};
  var parcel = new _Parcel2.default(ssn.parcels);
  var details = parcel.getDetails(req.params.pId);

  if (req.method === 'POST') {
    var changed = parcel.changeOrder(req.params.pId, req.body, ssn.user.id);

    res.render('change_order', {
      title: 'Parcels | SendIT',
      path: '../../../../',
      user: ssn.user || false,
      parcel: changed,
      error: parcel.error,
      changed: !parcel.error
    });
  } else {
    res.render('change_order', {
      title: 'Parcels | SendIT',
      path: '../../../../',
      user: ssn.user || false,
      parcel: details,
      error: parcel.error
    });
  }
});

exports.default = router;