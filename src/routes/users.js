import fs from 'fs';
import express from 'express';
import session from 'express-session';
import User from '../controllers/User';
import Parcel from '../controllers/Parcel';

let ssn;
const router = express.Router();

router.use(session({
  secret: 'rwajon@sendit',
  resave: true,
  saveUninitialized: true,
}));

/* -------------------static users-----------------------------*/
const staticUsers = JSON.parse(fs.readFileSync('JSONFiles/users.json'));
/*-----------------------------------------------------------*/
/* -------------------static orders-----------------------------*/
const staticOrders = JSON.parse(fs.readFileSync('JSONFiles/parcels.json'));
/* --------------------------------------------------------------*/

// sign-in
router.get('/', (req, res) => {
  ssn = req.session;

  res.render('signin', {
    title: 'Users | SendIT',
    path: '../',
    user: ssn.user || false,
  });
});

// sign-out
router.get('/signout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/users/signin');
  });
});

// sign-up
router.all('/signup', (req, res) => {
  ssn = req.session;
  ssn.users = ssn.users || {};
  const user = new User(ssn.users);

  if (req.method === 'POST') {
    const newUser = user.signup(req.body);

    if (!user.error) {
      res.redirect(`/users/${newUser.id}`);
    }

    ssn.user = ssn.user || false;

    res.render('signup', {
      title: 'Sign-up | SendIT',
      path: '../',
      user: ssn.user,
      error: user.user,
    });
  } else {
    res.render('signup', {
      title: 'Sign-up | SendIT',
      path: '../',
      user: ssn.user || false,
    });
  }
});

// sign-in
router.all('/signin', (req, res) => {
  ssn = req.session;

  if (req.method === 'POST') {
    ssn.users = ssn.users || staticUsers;
    const user = new User(ssn.users);
    const account = user.signin(req.body);

    if (!user.error) {
      ssn.user = account;
      res.redirect(`/users/${ssn.user.id}`);
    }

    ssn.user = ssn.user || false;

    res.render('signin', {
      title: 'Sign-in | SendIT',
      path: '../',
      user: ssn.user,
      error: user.error,
    });
  } else {
    res.render('signin', {
      title: 'Sign-in | SendIT',
      path: '../',
      user: ssn.user || false,
    });
  }
});

// Fetch a specific user information
router.get('/:id', (req, res) => {
  ssn = req.session;
  ssn.users = ssn.users || {};
  const user = new User(ssn.users);
  const userInfo = user.getInfo(req.params.id);

  if (!user.error) {
    ssn.user = userInfo;
  }

  res.render('users', {
    title: 'Users | SendIT',
    path: '../',
    user: ssn.user || false,
    error: user.error,
  });
});


/* ----Parcel delivery order-----*/
// Count all parcel delivery orders of a specific user
router.get('/parcels/count', (req, res) => {
  ssn = req.session;

  if (ssn.user) {
    let pending = 0;
    let inTransit = 0;
    let delivered = 0;

    Object.keys(ssn.parcels).forEach((key) => {
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

    const parcels = {
      pending,
      inTransit,
      delivered,
    };

    res.send(parcels);
  } else {
    res.send(false);
  }
});

// Fetch all parcel delivery orders of a specific user
router.get('/:id/parcels', (req, res) => {
  ssn = req.session;
  ssn.parcels = ssn.parcels || staticOrders;
  const parcel = new Parcel(ssn.parcels);
  ssn.parcels = parcel.getAll(req.params.id);

  res.render('all_orders', {
    title: 'Parcels | SendIT',
    path: '../../',
    user: ssn.user || false,
    parcels: ssn.parcels,
    error: parcel.error,
  });
});

// Create a parcel delivery order
router.post('/:id/parcels', (req, res) => {
  ssn = req.session;
  ssn.parcels = ssn.parcels || {};
  const parcel = new Parcel(ssn.parcels);

  if (req.method === 'POST') {
    const createdOrder = parcel.createOrder(req.body, ssn.user);

    if (Object.keys(createdOrder).length > 0) {
      res.redirect(`/users/${ssn.user.id}/parcels/${createdOrder.orderId}`);
    }

    res.render('create_order', {
      title: 'Parcels | SendIT',
      path: '../../../',
      user: ssn.user || false,
      error: parcel.error,
    });
  }
});

router.get('/:id/parcels/create', (req, res) => {
  ssn = req.session;
  ssn.parcels = ssn.parcels || {};
  const parcel = new Parcel(ssn.parcels);

  res.render('create_order', {
    title: 'Parcels | SendIT',
    path: '../../../',
    user: ssn.user || false,
  });
});

// Fetch all created parcel delivery orders of a specific user
router.get('/:id/parcels/pending', (req, res) => {
  ssn = req.session;
  ssn.parcels = ssn.parcels || {};
  const parcel = new Parcel(ssn.parcels);
  const pending = parcel.getPending(req.params.id);

  res.render('pending_orders', {
    title: 'Parcels | SendIT',
    path: '../../../',
    user: ssn.user || false,
    parcels: pending,
    error: parcel.error,
  });
});

// Fetch all parcels in transit of a specific user
router.get('/:id/parcels/in-transit', (req, res) => {
  ssn = req.session;
  ssn.parcels = ssn.parcels || {};
  const parcel = new Parcel(ssn.parcels);
  const inTransit = parcel.getInTransit(req.params.id);

  res.render('parcels_in_transit', {
    title: 'Parcels | SendIT',
    path: '../../../',
    user: ssn.user || false,
    parcels: inTransit,
    error: parcel.error,
  });
});

// Fetch all delivered parcel orders of a specific user
router.get('/:id/parcels/delivered', (req, res) => {
  ssn = req.session;
  ssn.parcels = ssn.parcels || {};
  const parcel = new Parcel(ssn.parcels);
  const delivered = parcel.getDelivered(req.params.id);

  res.render('delivered_parcels', {
    title: 'Parcels | SendIT',
    path: '../../../',
    user: ssn.user || false,
    parcels: delivered,
    error: parcel.error,
  });
});

// Fetch a specific parcel delivery oder of a specific user
router.get('/:id/parcels/:pId', (req, res) => {
  ssn = req.session;
  ssn.parcels = ssn.parcels || {};
  const parcel = new Parcel(ssn.parcels);
  const details = parcel.getDetails(req.params.pId);

  res.render('order_details', {
    title: 'Parcels | SendIT',
    path: '../../../',
    user: ssn.user || false,
    parcel: details,
    error: parcel.error,
  });
});

// Cancel a specific parcel delivery order of a specific user
router.get('/:id/parcels/:pId/cancel', (req, res) => {
  ssn = req.session;

  if (ssn.parcels && req.params.id) {
    Object.keys(ssn.parcels).forEach((key) => {
      if (ssn.parcels[key].orderId === req.params.pId) {
        delete ssn.parcels[key];
        res.redirect('back');
      }
    });
  }
});

// Change a specific parcel delivery order of a specific user
router.all('/:id/parcels/:pId/change', (req, res) => {
  ssn = req.session;
  ssn.parcels = ssn.parcels || {};
  const parcel = new Parcel(ssn.parcels);
  const details = parcel.getDetails(req.params.pId);

  if (req.method === 'POST') {
    const changed = parcel.changeOrder(req.params.pId, req.body, ssn.user.id);

    res.render('change_order', {
      title: 'Parcels | SendIT',
      path: '../../../../',
      user: ssn.user || false,
      parcel: changed,
      error: parcel.error,
      changed: !parcel.error,
    });
  } else {
    res.render('change_order', {
      title: 'Parcels | SendIT',
      path: '../../../../',
      user: ssn.user || false,
      parcel: details,
      error: parcel.error,
    });
  }
});

export default router;
