import fs from 'fs';
import express from 'express';
import Parcel from '../../controllers/Parcel';

let ssn;
const router = express.Router();

// Create a parcel delivery order
router.post('/', async (req, res) => {
  ssn = req.session;
  ssn.user = ssn.user || {};

  const parcel = new Parcel();
  const order = await parcel.createOrder(req.body, ssn.user);

  if (!parcel.error) {
    return res.status(201).json({
      status: 'Successful',
      order,
    });
  }
  return res.status(200).json({
    error: parcel.error,
  });
});

// Fetch all parcel delivery orders
router.get('/', async (req, res) => {
  ssn = req.session;
  const parcel = new Parcel();
  const parcels = await parcel.getAll();

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

// Fetch all pending parcel delivery orders
router.get('/pending', async (req, res) => {
  ssn = req.session;
  const parcel = new Parcel();
  const pending = await parcel.getPending();

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

// Fetch all parcels in transit
router.get('/in-transit', async (req, res) => {
  ssn = req.session;
  const parcel = new Parcel();
  const inTransit = await parcel.getInTransit();

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

// Fetch all delivered parcel
router.get('/delivered', async (req, res) => {
  ssn = req.session;
  const parcel = new Parcel();
  const delivered = await parcel.getDelivered();

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

// Fetch a specific parcel delivery oder
router.get('/:pId', async (req, res) => {
  ssn = req.session;
  const parcel = new Parcel();
  const order = await parcel.getOrder(req.params.pId);

  if (!parcel.error) {
    return res.status(200).json({
      status: 'Successfull',
      order,
    });
  }
  return res.json({
    error: parcel.error,
  });
});

// Change the destination a specific parcel delivery order
router.put('/:pId/destination', async (req, res) => {
  ssn = req.session;
  ssn.user = ssn.user || {};
  const parcel = new Parcel();
  const changed = await parcel.changeDestination(req.params.pId, req.body, ssn.user.id);

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

// Change the status a specific parcel delivery order
router.put('/:pId/status', async (req, res) => {
  ssn = req.session;
  ssn.admin = ssn.admin || {};
  const parcel = new Parcel();
  const changed = await parcel.changeStatus(req.params.pId, req.body);

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

// Change the presen lLocation a specific parcel delivery order
router.put('/:pId/presentLocation', async (req, res) => {
  ssn = req.session;
  ssn.admin = ssn.admin || {};
  const parcel = new Parcel();
  const changed = await parcel.changePresentLocation(req.params.pId, req.body);

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

// Cancel a specific parcel delivery order
router.put('/:pId/cancel', async (req, res) => {
  ssn = req.session;
  ssn.user = ssn.user || {};
  const parcel = new Parcel();
  const cancelled = await parcel.cancelOrder(req.params.pId, ssn.user.id);

  if (!parcel.error) {
    return res.status(200).json({
      status: 'Successfull',
      cancelled,
    });
  }
  return res.json({
    error: parcel.error,
  });
});


export default router;