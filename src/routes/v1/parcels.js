import express from 'express';
import verifyToken from '../../middlewares/verifyToken';
import Parcel from '../../controllers/Parcel';

const router = express.Router();

// Create a parcel delivery order
router.post('/', verifyToken, async (req, res) => {
  if (!req.userId) {
    return res.status(401).json({
      error: 'Sorry, you don\'t have access to this route',
    });
  }

  const parcel = new Parcel();
  const order = await parcel.createOrder(req.body, req.userId);

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
router.get('/', verifyToken, async (req, res) => {
  if (!req.adminId) {
    return res.status(401).json({
      error: 'Sorry, you don\'t have access to this route',
    });
  }

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
router.get('/pending', verifyToken, async (req, res) => {
  if (!req.adminId) {
    return res.status(401).json({
      error: 'Sorry, you don\'t have access to this route',
    });
  }

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
router.get('/inTransit', verifyToken, async (req, res) => {
  if (!req.adminId) {
    return res.status(401).json({
      error: 'Sorry, you don\'t have access to this route',
    });
  }

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
router.get('/delivered', verifyToken, async (req, res) => {
  if (!req.adminId) {
    return res.status(401).json({
      error: 'Sorry, you don\'t have access to this route',
    });
  }

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
router.get('/:pId', verifyToken, async (req, res) => {
  const parcel = new Parcel();
  const order = await parcel.getOrder(req.params.pId, req.userId);

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
router.put('/:pId/destination', verifyToken, async (req, res) => {
  if (!req.userId) {
    return res.status(401).json({
      error: 'Sorry, you don\'t have access to this route',
    });
  }

  const parcel = new Parcel();
  const changed = await parcel.changeDestination(req.params.pId, req.body, req.userId);

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
router.put('/:pId/status', verifyToken, async (req, res) => {
  if (!req.adminId) {
    return res.status(401).json({
      error: 'Sorry, you don\'t have access to this route',
    });
  }

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

// Change the present location a specific parcel delivery order
router.put('/:pId/presentLocation', verifyToken, async (req, res) => {
  if (!req.adminId) {
    return res.status(401).json({
      error: 'Sorry, you don\'t have access to this route',
    });
  }

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
router.put('/:pId/cancel', verifyToken, async (req, res) => {
  if (!req.userId) {
    return res.status(401).json({
      error: 'Sorry, you don\'t have access to this route',
    });
  }

  const parcel = new Parcel();
  const cancelled = await parcel.cancelOrder(req.params.pId, req.userId);

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
