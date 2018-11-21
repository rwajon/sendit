import fs from 'fs';
import express from 'express';
import session from 'express-session';
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

// Fetch all parcel delivery orders
router.get('/', (req, res) => {
  ssn = req.session;
  ssn.parcels = ssn.parcels || staticOrders;
  const parcel = new Parcel(ssn.parcels);
  ssn.parcels = parcel.getAll();

  if (!parcel.error) {
    return res.status(200).json({
      status: 'Successfull',
      parcels: ssn.parcels,
    });

  } else {
    return res.json({
      error: parcel.error,
    });
  }
});

// Create a parcel delivery order
router.post('/', (req, res) => {
  ssn = req.session;
  ssn.parcels = ssn.parcels || staticOrders;
  ssn.user = ssn.user || staticUsers.user6781;

  const parcel = new Parcel(ssn.parcels);
  const order = parcel.createOrder(req.body, ssn.user);

  if (!parcel.error) {
    return res.status(200).json({
      status: 'Successfull',
      order,
    });
  } else {
    return res.status(200).json({
      error: parcel.error,
    });
  }
});

// Fetch all pending parcel delivery orders
router.get('/pending', (req, res) => {
  ssn = req.session;
  ssn.parcels = ssn.parcels || staticOrders;
  const parcel = new Parcel(ssn.parcels);
  const pending = parcel.getPending();

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

// Fetch all parcels in transit
router.get('/in-transit', (req, res) => {
  ssn = req.session;
  ssn.parcels = ssn.parcels || staticOrders;
  const parcel = new Parcel(ssn.parcels);
  const inTransit = parcel.getInTransit();

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

// Fetch all delivered parcel
router.get('/delivered', (req, res) => {
  ssn = req.session;
  ssn.parcels = ssn.parcels || staticOrders;
  const parcel = new Parcel(ssn.parcels);
  const delivered = parcel.getDelivered();

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

// Fetch a specific parcel delivery oder
router.get('/:pId', (req, res) => {
  ssn = req.session;
  ssn.parcels = ssn.parcels || staticOrders;
  const parcel = new Parcel(ssn.parcels);
  const order = parcel.getOrder(req.params.pId);

  if (!parcel.error) {
    return res.status(200).json({
      status: 'Successfull',
      order,
    });

  } else {
    return res.json({
      error: parcel.error,
    });
  }
});

// Cancel a specific parcel delivery order of a specific user
router.put('/:pId/cancel', (req, res) => {
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

// Change a specific parcel delivery order of a specific user
router.all('/:pId/change', (req, res) => {
  ssn = req.session;
  ssn.parcels = ssn.parcels || staticOrders;
  const parcel = new Parcel(ssn.parcels);
  const details = parcel.getOrder(req.params.pId);

  if (req.method === 'POST') {
    const changed = parcel.changeOrder(req.params.pId, req.body);

    res.send({
      changed,
      error: parcel.error,
    });
  } else {
    res.send({
      parcelDetails: details,
      error: parcel.error,
    });
  }
});

export default router;