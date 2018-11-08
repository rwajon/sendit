import fs from 'fs';
import express from 'express';
import session from 'express-session';
import Parcel from '../../private/Parcel';

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
  const staticOrders = JSON.parse(fs.readFileSync('private/parcels.json'));
  /* --------------------------------------------------------------*/
  ssn.parcels = ssn.parcels || staticOrders;
  const parcel = new Parcel(ssn.parcels);
  ssn.parcels = parcel.getAll();

  res.render('v1/admin_all_orders', {
    title: 'Parcels | SendIT',
    path: '../../../',
    apiVersion: 'api/v1',
    admin: true,
    parcels: ssn.parcels,
    error: parcel.error,
  });
});

// Fetch all created parcel delivery orders
router.get('/created', (req, res) => {
  ssn = req.session;
  ssn.parcels = ssn.parcels || {};
  const parcel = new Parcel(ssn.parcels);
  const newCreated = parcel.getNewCreated();

  res.render('v1/admin_created_orders', {
    title: 'Parcels | SendIT',
    path: '../../../',
    apiVersion: 'api/v1',
    admin: true,
    parcels: newCreated,
    error: parcel.error,
  });
});

// Fetch all parcels in transit
router.get('/in-transit', (req, res) => {
  ssn = req.session;
  ssn.parcels = ssn.parcels || {};
  const parcel = new Parcel(ssn.parcels);
  const inTransit = parcel.getInTransit();

  res.render('v1/admin_parcels_in_transit', {
    title: 'Parcels | SendIT',
    path: '../../../',
    apiVersion: 'api/v1',
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

  res.render('v1/admin_delivered_parcels', {
    title: 'Parcels | SendIT',
    path: '../../../',
    apiVersion: 'api/v1',
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

  res.render('v1/order_details', {
    title: 'Parcels | SendIT',
    path: '../../../',
    apiVersion: 'api/v1',
    admin: true,
    parcel: details,
    error: parcel.error,
  });
});

// Change a specific parcel delivery order of a specific user
router.all('/:pId/change', (req, res) => {
  ssn = req.session;
  ssn.parcels = ssn.parcels || {};
  const parcel = new Parcel(ssn.parcels);
  const details = parcel.getDetails(req.params.pId);

  if (req.method === 'POST') {
    const changed = parcel.changeOrder(req.params.pId, req.body);

    res.render('v1/admin_change_order', {
      title: 'Parcels | SendIT',
      path: '../../../../',
      apiVersion: 'api/v1',
      admin: true,
      parcel: changed,
      error: parcel.error,
      changed: !parcel.error,
    });
  } else {
    res.render('v1/admin_change_order', {
      title: 'Parcels | SendIT',
      path: '../../../../',
      apiVersion: 'api/v1',
      admin: true,
      parcel: details,
      error: parcel.error,
    });
  }
});

export default router;
