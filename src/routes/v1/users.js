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
router.get('/:userId/parcels/in-transit', async (req, res) => {
  ssn = req.session;
  ssn.user = ssn.user || {};
  const parcel = new Parcel();
  const inTransit = await parcel.getInTransit(req.params.userId);

  if (!parcel.error) {
    return res.status(200).json({
      status: 'Successful',
      inTransit,
    });
  }
  return res.json({
    error: parcel.error,
  });
});

// Fetch all delivered parcel orders of a specific user
router.get('/:userId/parcels/delivered', async (req, res) => {
  ssn = req.session;
  ssn.user = ssn.user || {};
  const parcel = new Parcel();
  const delivered = await parcel.getDelivered(req.params.userId);

  if (!parcel.error) {
    return res.status(200).json({
      status: 'Successful',
      delivered,
    });
  }
  return res.json({
    error: parcel.error,
  });
});

export default router;