import fs from 'fs';
import express from 'express';
import session from 'express-session';
import User from '../../controllers/User';
import Parcel from '../../controllers/Parcel';

let ssn;
const router = express.Router();

router.use(session({
  secret: 'rwajon@sendit',
  resave: true,
  saveUninitialized: true,
}));

/* -------------------static users-----------------------------*/
const staticUsers = JSON.parse(fs.readFileSync('src/models/users.json'));
/*-----------------------------------------------------------*/
/* -------------------static orders-----------------------------*/
const staticOrders = JSON.parse(fs.readFileSync('src/models/parcels.json'));
/* --------------------------------------------------------------*/

// sign-up
router.post('/signup', (req, res) => {
  ssn = req.session;
  ssn.users = ssn.users || staticUsers;

  const user = new User(ssn.users);
  const newUser = user.signup(req.body);

  if (!user.error) {
    return res.status(200).json({
      status: 'Successfull',
      newUser,
    });
  }else{
    return res.status(200).json({
      error: user.error,
    });
  }
});

// sign-in
router.post('/signin', (req, res) => {
  ssn = req.session;
  ssn.users = ssn.users || staticUsers;
  ssn.parcels = ssn.parcels || staticOrders;

  const user = new User(ssn.users);
  const parcel = new Parcel(ssn.parcels);
  const account = user.signin(req.body);

  if (!user.error) {
    ssn.user = account;
    ssn.parcels = parcel.getAll(ssn.user.id);

    return res.status(200).json({
      status: 'Successfull',
      message: `Welcome ${ssn.user.fname} ${ssn.user.lname}`,
      user: ssn.user,
    });
    
  }else{
    return res.json({
      error: user.error,
    });
  }
});

// Fetch a specific user information
router.get('/:id', (req, res) => {
  ssn = req.session;
  ssn.users = ssn.users || staticUsers;
  const user = new User(ssn.users);
  const userInfo = user.getInfo(req.params.id);

  if (!user.error) {
    ssn.user = userInfo;
    res.send({
      userInfo: ssn.user,
    });
  }

  res.send({
    error: user.error,
  });
});

/* ----Parcel delivery order-----*/
// Fetch all parcel delivery orders of a specific user
router.get('/:id/parcels', (req, res) => {
  ssn = req.session;
  // ssn.parcels = ssn.parcels || {};
  ssn.parcels = ssn.parcels || staticOrders;
  const parcel = new Parcel(ssn.parcels);
  ssn.parcels = parcel.getAll(req.params.id);

  res.send({
    user: ssn.user,
    allParcels: ssn.parcels,
    error: parcel.error,
  });
});

// Fetch all pending parcel delivery orders of a specific user
router.get('/:id/parcels/pending', (req, res) => {
  ssn = req.session;
  ssn.parcels = ssn.parcels || staticOrders;
  const parcel = new Parcel(ssn.parcels);
  const pending = parcel.getPending(req.params.id);

  if (!parcel.error) {
    return res.status(200).json({
      status: 'Successfull',
      pending,
    });

  } else {
    return res.json({
      error: parcel.error,
    });
  }
});

// Fetch all parcels in transit of a specific user
router.get('/:id/parcels/in-transit', (req, res) => {
  ssn = req.session;
  // ssn.parcels = ssn.parcels || {};
  ssn.parcels = ssn.parcels || staticOrders;
  const parcel = new Parcel(ssn.parcels);
  const inTransit = parcel.getInTransit(req.params.id);

  res.send({
    user: ssn.user,
    inTransit,
    error: parcel.error,
  });
});

router.get('/:id/parcels/in-transit', (req, res) => {
  ssn = req.session;
  ssn.parcels = ssn.parcels || staticOrders;
  const parcel = new Parcel(ssn.parcels);
  const inTransit = parcel.getInTransit(req.params.id);

  if (!parcel.error) {
    return res.status(200).json({
      status: 'Successfull',
      inTransit,
    });

  } else {
    return res.json({
      error: parcel.error,
    });
  }
});

// Fetch all delivered parcel orders of a specific user
router.get('/:id/parcels/delivered', (req, res) => {
  ssn = req.session;
  ssn.parcels = ssn.parcels || staticOrders;
  const parcel = new Parcel(ssn.parcels);
  const delivered = parcel.getDelivered(req.params.id);

  if (!parcel.error) {
    return res.status(200).json({
      status: 'Successfull',
      delivered,
    });

  } else {
    return res.json({
      error: parcel.error,
    });
  }
});

// Fetch a specific parcel delivery oder of a specific user
router.get('/:id/parcels/:pId', (req, res) => {
  ssn = req.session;
  // ssn.parcels = ssn.parcels || {};
  ssn.parcels = ssn.parcels || staticOrders;
  const parcel = new Parcel(ssn.parcels);
  const details = parcel.getOrder(req.params.pId);

  res.send({
    user: ssn.user,
    parcelDetails: details,
    error: parcel.error,
  });
});

// Change a specific parcel delivery order of a specific user
router.put('/:id/parcels/:pId/change', (req, res) => {
  ssn = req.session;
  ssn.parcels = ssn.parcels || staticOrders;
  const parcel = new Parcel(ssn.parcels);
  const changed = parcel.changeOrder(req.params.pId, req.body, req.params.id);

  if (!parcel.error) {
    return res.status(200).json({
      status: 'Successfull',
      changed,
    });

  } else {
    return res.json({
      error: parcel.error,
    });
  }
});

// Cancel a specific parcel delivery order of a specific user
router.put('/:id/parcels/:pId/cancel', (req, res) => {
  ssn = req.session;
  ssn.parcels = ssn.parcels || staticOrders;

  if (ssn.parcels && req.params.pId) {
    Object.keys(ssn.parcels).forEach((key) => {
      if (ssn.parcels[key].orderId === req.params.pId) {
        delete ssn.parcels[key];
        res.send('Cancelled');
      }
    });
  }
});

export default router;
