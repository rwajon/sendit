import express from 'express';
import verifyToken from '../../middlewares/verifyToken';
import Parcel from '../../controllers/Parcel';

const router = express.Router();

/* ----Parcel delivery orders-----*/
// Fetch all parcel delivery orders of a specific user
router.get('/:userId/parcels', verifyToken, async (req, res) => {
  if (!req.userId) {
    return res.status(401).json({
      error: 'Sorry, you don\'t have access to this route',
    });
  }

  if (parseInt(req.userId, 10) !== parseInt(req.params.userId, 10)) {
    return res.status(401).json({
      error: 'Sorry, you can not view these orders',
    });
  }

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
router.get('/:userId/parcels/pending', verifyToken, async (req, res) => {
  if (!req.userId) {
    return res.status(401).json({
      error: 'Sorry, you don\'t have access to this route',
    });
  }

  if (parseInt(req.userId, 10) !== parseInt(req.params.userId, 10)) {
    return res.status(401).json({
      error: 'Sorry, you can not view these orders',
    });
  }

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
router.get('/:userId/parcels/in-transit', verifyToken, async (req, res) => {
  if (!req.userId) {
    return res.status(401).json({
      error: 'Sorry, you don\'t have access to this route',
    });
  }

  if (parseInt(req.userId, 10) !== parseInt(req.params.userId, 10)) {
    return res.status(401).json({
      error: 'Sorry, you can not view these orders',
    });
  }

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
router.get('/:userId/parcels/delivered', verifyToken, async (req, res) => {
  if (!req.userId) {
    return res.status(401).json({
      error: 'Sorry, you don\'t have access to this route',
    });
  }

  if (parseInt(req.userId, 10) !== parseInt(req.params.userId, 10)) {
    return res.status(401).json({
      error: 'Sorry, you can not view these orders',
    });
  }

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
