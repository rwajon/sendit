import fs from 'fs';
import express from 'express';
import User from '../../controllers/User';
import Parcel from '../../controllers/Parcel';

let ssn;
const router = express.Router();

/* -------------------static users-----------------------------*/
const staticUsers = JSON.parse(fs.readFileSync('src/models/users.json'));
/*-----------------------------------------------------------*/
/* -------------------static orders-----------------------------*/
const staticOrders = JSON.parse(fs.readFileSync('src/models/parcels.json'));
/* --------------------------------------------------------------*/

// sign-up
router.post('/signup', async (req, res) => {
  ssn = req.session;
  const user = new User();
  const newUser = await user.signup(req.body);

  if (!user.error) {
    ssn.user = newUser;
    return res.status(201).json({
      status: 'Successful',
      newUser,
    });
  }

  return res.status(200).json({
    error: user.error,
  });

});

// sign-in
router.post('/signin', async (req, res) => {
  ssn = req.session;
  const user = new User();
  const account = await user.signin(req.body);

  if (!user.error) {
    ssn.user = account;
    return res.status(202).json({
      status: 'Successfull',
      message: `Welcome ${ssn.user.fname} ${ssn.user.lname}`,
      user: ssn.user,
    });
  }
  
  return res.status(200).json({
    error: user.error,
  });
});

/* ----Parcel delivery orders-----*/
// Fetch all parcel delivery orders of a specific user
router.get('/:userId/parcels', async (req, res) => {
  ssn = req.session;
  ssn.user = ssn.user || {};
  const parcel = new Parcel();
  const parcels = await parcel.getAll(req.params.userId);

  if (!parcel.error) {
    return res.status(200).json({
      status: 'Successful',
      parcels,
    });
  }
  return res.json({
    error: parcel.error,
  });
});

// Fetch all pending parcel delivery orders of a specific user
router.get('/:userId/parcels/pending', async (req, res) => {
  ssn = req.session;
  ssn.user = ssn.user || {};
  const parcel = new Parcel();
  const pending = await parcel.getPending(req.params.userId);

  if (!parcel.error) {
    return res.status(200).json({
      status: 'Successful',
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