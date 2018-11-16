import fs from 'fs';
import express from 'express';
import session from 'express-session';
import Parcel from '../controllers/Parcel';

let ssn;
const router = express.Router();

router.use(session({
  secret: 'rwajon@sendit',
  resave: true,
  saveUninitialized: true,
}));

// Fetch all parcel delivery orders
router.get('/', (req, res) => {
  ssn = req.session;
  /* -------------------static orders-----------------------------*/
  const staticOrders = JSON.parse(fs.readFileSync('JSONFiles/parcels.json'));
  /* --------------------------------------------------------------*/
  ssn.parcels = ssn.parcels || staticOrders;
  const parcel = new Parcel(ssn.parcels);
  ssn.parcels = parcel.getAll();

  res.render('admin_all_orders', {
    title: 'Parcels | SendIT',
    path: '../',
    admin: true,
    parcels: ssn.parcels,
    error: parcel.error,
  });
});

// Fetch all pending parcel delivery orders
router.get('/pending', (req, res) => {
  ssn = req.session;
  ssn.parcels = ssn.parcels || {};
  const parcel = new Parcel(ssn.parcels);
  const pending = parcel.getPending();

  res.render('admin_pending_orders', {
    title: 'Parcels | SendIT',
    path: '../',
    admin: true,
    parcels: pending,
    error: parcel.error,
  });
});

// Fetch all parcels in transit
router.get('/in-transit', (req, res) => {
  ssn = req.session;
  ssn.parcels = ssn.parcels || {};
  const parcel = new Parcel(ssn.parcels);
  const inTransit = parcel.getInTransit();

  res.render('admin_parcels_in_transit', {
    title: 'Parcels | SendIT',
    path: '../',
    admin: true,
    parcels: inTransit,
    error: parcel.error,
  });
});

// Fetch all delivered parcel
router.get('/delivered', (req, res) => {
  ssn = req.session;
  ssn.parcels = ssn.parcels || {};
  const parcel = new Parcel(ssn.parcels);
  const delivered = parcel.getDelivered();

  res.render('admin_delivered_parcels', {
    title: 'Parcels | SendIT',
    path: '../',
    admin: true,
    parcels: delivered,
    error: parcel.error,
  });
});

// Fetch a specific parcel delivery oder
router.get('/:pId', (req, res) => {
  ssn = req.session;
  ssn.parcels = ssn.parcels || {};
  const parcel = new Parcel(ssn.parcels);
  const details = parcel.getDetails(req.params.pId);

  res.render('order_details', {
    title: 'Parcels | SendIT',
    path: '../',
    admin: true,
    parcel: details,
    error: parcel.error,
  });
});

// Cancel a specific parcel delivery order of a specific user
router.put('/:pId/cancel', (req, res) => {
  ssn = req.session;

  if (ssn.parcels && req.params.pId) {
    Object.keys(ssn.parcels).forEach((key) => {
      if (ssn.parcels[key].orderId === req.params.pId) {
        delete ssn.parcels[key];
        res.send('Cancelled');
      }
    });
  }
});

// Change a specific parcel delivery order of a specific user
router.all('/:pId/change', (req, res) => {
  ssn = req.session;
  ssn.parcels = ssn.parcels || {};
  const parcel = new Parcel(ssn.parcels);
  const details = parcel.getDetails(req.params.pId);

  if (req.method === 'POST') {
    const changed = parcel.changeOrder(req.params.pId, req.body);

    res.render('admin_change_order', {
      title: 'Parcels | SendIT',
      path: '../../',
      admin: true,
      parcel: changed,
      error: parcel.error,
      changed: !parcel.error,
    });
  } else {
    res.render('admin_change_order', {
      title: 'Parcels | SendIT',
      path: '../../',
      admin: true,
      parcel: details,
      error: parcel.error,
    });
  }
});

export default router;
