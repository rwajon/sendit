import fs from 'fs';
import express from 'express';
import session from 'express-session';

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
  /* -------------------static parcels-----------------------------*/
  ssn.parcels = JSON.parse(fs.readFileSync('private/parcels.json'));
  /* --------------------------------------------------------------*/

  res.render('v1/admin_all_orders', {
    title: 'Parcels | SendIT',
    path: '../../../',
    apiVersion: 'api/v1',
    admin: true,
    parcels: ssn.parcels,
  });
});

// Fetch all created parcel delivery orders
router.get('/created', (req, res) => {
  ssn = req.session;
  const parcels = {};

  if (ssn.parcels) {
    Object.keys(ssn.parcels).forEach((key) => {
      if (ssn.parcels[key].status === 'Unprocessed') {
        parcels[key] = ssn.parcels[key];
      }
    });
  }

  res.render('v1/admin_created_orders', {
    title: 'Parcels | SendIT',
    path: '../../../',
    apiVersion: 'api/v1',
    admin: true,
    parcels,
  });
});

// Fetch all parcels in transit
router.get('/in-transit', (req, res) => {
  ssn = req.session;
  const parcels = {};

  if (ssn.parcels) {
    Object.keys(ssn.parcels).forEach((key) => {
      if (ssn.parcels[key].status === 'In transit') {
        parcels[key] = ssn.parcels[key];
      }
    });
  }

  res.render('v1/admin_parcels_in_transit', {
    title: 'Parcels | SendIT',
    path: '../../../',
    apiVersion: 'api/v1',
    admin: true,
    parcels,
  });
});

// Fetch all delivered parcel
router.get('/delivered', (req, res) => {
  ssn = req.session;
  const parcels = {};

  if (ssn.parcels) {
    Object.keys(ssn.parcels).forEach((key) => {
      if (ssn.parcels[key].status === 'Delivered') {
        parcels[key] = ssn.parcels[key];
      }
    });
  }

  res.render('v1/admin_delivered_parcels', {
    title: 'Parcels | SendIT',
    path: '../../../',
    apiVersion: 'api/v1',
    admin: true,
    parcels,
  });
});

// Fetch a specific parcel delivery oder
router.get('/:p_id', (req, res) => {
  ssn = req.session;
  let parcel = {};

  if (ssn.parcels) {
    Object.keys(ssn.parcels).forEach((key) => {
      if (ssn.parcels[key].orderId === req.params.p_id) {
        parcel = ssn.parcels[key];

        res.render('v1/order_details', {
          title: 'Parcels | SendIT',
          path: '../../../',
          apiVersion: 'api/v1',
          admin: true,
          parcel,
        });
      }
    });
  }

  res.redirect('/api/v1/parcels');
});

// Change a specific parcel delivery order of a specific user
router.all('/:p_id/change', (req, res) => {
  ssn = req.session;
  let parcel = {};

  if (req.method === 'POST') {
    Object.keys(ssn.parcels).forEach((key) => {
      if (ssn.parcels[key].orderId === req.params.p_id) {
        if (req.body.new_status) {
          ssn.parcels[key].status = req.body.new_status;
        }
        if (req.body.new_country) {
          ssn.parcels[key].presentLocation = req.body.new_country;
        }
        if (req.body.new_city) {
          ssn.parcels[key].presentLocation += `, ${req.body.new_city}`;
        }
        if (req.body.new_address) {
          ssn.parcels[key].presentLocation += ` - ${req.body.new_address}`;
        }

        parcel = ssn.parcels[key];

        res.render('v1/admin_change_order', {
          title: 'Parcels | SendIT',
          path: '../../../../',
          apiVersion: 'api/v1',
          admin: true,
          parcel,
          changed: true,
        });
      }
    });
  } else {
    if (ssn.parcels) {
      Object.keys(ssn.parcels).forEach((key) => {
        if (ssn.parcels[key].orderId === req.params.p_id) {
          parcel = ssn.parcels[key];

          res.render('v1/admin_change_order', {
            title: 'Parcels | SendIT',
            path: '../../../../',
            apiVersion: 'api/v1',
            admin: true,
            parcel,
          });
        }
      });
    }

    res.redirect('/api/v1/parcels');
  }
});

export default router;
