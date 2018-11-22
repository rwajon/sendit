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
  }
  return res.status(200).json({
    error: user.error,
  });
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
  }
  return res.json({
    error: user.error,
  });
});

/* ----Parcel delivery orders-----*/
// Fetch all parcel delivery orders of a specific user
router.get('/:id/parcels', (req, res) => {
  ssn = req.session;
  ssn.parcels = ssn.parcels || staticOrders;
  const parcel = new Parcel(ssn.parcels);
  const parcels = parcel.getAll(req.params.id);

  if (!parcel.error) {
    return res.status(200).json({
      status: 'Successfull',
      parcels,
    });
  }
  return res.json({
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
  }
  return res.json({
    error: parcel.error,
  });
});

// Fetch all parcels in transit of a specific user
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
  }
  return res.json({
    error: parcel.error,
  });
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
  }
  return res.json({
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
  }
  return res.json({
    error: parcel.error,
  });
});

export default router;
