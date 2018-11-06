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

// sign-in
router.get('/', (req, res) => {
  ssn = req.session;

  res.render('v1/signin', {
    title: 'Users | SendIT',
    path: '../../../',
    apiVersion: 'api/v1',
    user: ssn.user ? ssn.user : null,
  });
});

// sign-out
router.get('/signout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/api/v1/users/signin');
  });
});

// sign-up
router.all('/signup', (req, res) => {
  ssn = req.session;
  /* -------------------static users-----------------------------*/
  ssn.users = JSON.parse(fs.readFileSync('private/users.json'));
  res.redirect('/api/v1/users/001');
  /*-----------------------------------------------------------*/

  if (req.method === 'POST') {
    if (req.body.fname && req.body.lname && req.body.uname && req.body.password) {
      const id = Math.random().toString().substr(2, 3);

      if (!ssn.users) { ssn.users = {}; }

      ssn.users[`user${id}`] = {
        id,
        fname: req.body.fname,
        lname: req.body.lname,
        uname: req.body.uname,
        password: req.body.password,
        phone: req.body.phone,
        email: req.body.email,
        country: req.body.country,
        city: req.body.city,
        address: req.body.address,
      };

      res.redirect(`/api/v1/users/${id}`);
    } else {
      res.render('v1/signup', {
        title: 'Sign-up | SendIT',
        path: '../../../',
        apiVersion: 'api/v1',
        user: ssn.user ? ssn.user : null,
        error: true,
      });
    }
  } else {
    res.render('v1/signup', {
      title: 'Sign-up | SendIT',
      path: '../../../',
      apiVersion: 'api/v1',
      user: ssn.user ? ssn.user : null,
    });
  }
});

// sign-in
router.all('/signin', (req, res) => {
  ssn = req.session;

  if (req.method === 'POST') {
    if (ssn.users) {
      Object.keys(ssn.users).forEach((key) => {
        if (ssn.users[key].uname === req.body.uname
          && ssn.users[key].password === req.body.password) {
          ssn.user = ssn.users[key];
          res.redirect(`/api/v1/users/${ssn.user.id}`);
        }
      });

      res.render('v1/signin', {
        title: 'Sign-in | SendIT',
        path: '../../../',
        apiVersion: 'api/v1',
        user: ssn.user ? ssn.user : false,
      });
    } else {
      res.render('v1/signin', {
        title: 'Sign-in | SendIT',
        path: '../../../',
        apiVersion: 'api/v1',
        user: ssn.user ? ssn.user : false,
        error: true,
      });
    }
  } else {
    res.render('v1/signin', {
      title: 'Sign-in | SendIT',
      path: '../../../',
      apiVersion: 'api/v1',
      user: ssn.user ? ssn.user : null,
    });
  }
});

// Fetch a specific user information
router.get('/:id', (req, res) => {
  ssn = req.session;

  if (ssn.users && req.params.id) {
    Object.keys(ssn.users).forEach((key) => {
      if (ssn.users[key].id === req.params.id) {
        ssn.user = ssn.users[key];

        res.render('v1/users', {
          title: 'Users | SendIT',
          path: '../../../',
          apiVersion: 'api/v1',
          user: ssn.user ? ssn.user : null,
        });
      }
    });

    res.redirect('/api/v1/users/signin');
  } else {
    res.redirect('/api/v1/users/signup');
  }
});


/* ----Parcel delivery order-----*/
// Fetch all parcel delivery orders of a specific user
router.get('/:id/parcels', (req, res) => {
  ssn = req.session;
  const parcels = {};
  /* -------------------static parcels-----------------------------*/
  ssn.parcels = JSON.parse(fs.readFileSync('private/parcels.json'));
  /* --------------------------------------------------------------*/

  if (ssn.parcels && req.params.id) {
    Object.keys(ssn.parcels).forEach((key) => {
      if (ssn.parcels[key].sender.id === ssn.user.id) {
        parcels[key] = ssn.parcels[key];
      }
    });

    res.render('v1/all_orders', {
      title: 'Parcels | SendIT',
      path: '../../../../../',
      apiVersion: 'api/v1',
      user: ssn.user ? ssn.user : null,
      parcels,
    });
  }

  res.render('v1/all_orders', {
    title: 'Parcels | SendIT',
    path: '../../../../../',
    apiVersion: 'api/v1',
    user: ssn.user ? ssn.user : null,
    parcels,
  });
});

// Create a parcel delivery order
router.all('/:id/parcels/create', (req, res) => {
  ssn = req.session;

  if (req.method === 'POST') {
    if (req.body.rname
      && req.body.dest_country
      && req.body.rphone
      && req.body.product
      && req.body.quantity) {
      const orderId = Math.random().toString().substr(2, 3);
      const price = Math.ceil(Math.random() * 100);

      if (!ssn.parcels) { ssn.parcels = {}; }

      ssn.parcels[`order${orderId}`] = {
        orderId,
        sender: {
          id: ssn.user.id,
          name: `${ssn.user.fname} ${ssn.user.lname}`,
          phone: ssn.user.phone,
          email: ssn.user.email,
          country: req.body.sender_country,
          city: req.body.sender_city,
          address: req.body.sender_address,
        },
        receiver: {
          name: req.body.rname,
          phone: req.body.rphone,
          email: req.body.remail,
          country: req.body.dest_country,
          city: req.body.dest_city,
          address: req.body.dest_address,
        },
        product: req.body.product,
        weight: req.body.weight,
        quantity: req.body.quantity,
        price: `USD ${price}`,
        status: 'Unprocessed',
        presentLocation: `${req.body.sender_country}, ${req.body.sender_city} - ${req.body.sender_address}`,
      };

      res.redirect(`/api/v1/users/${ssn.user.id}/parcels/${orderId}`);
    } else {
      res.render('v1/create_order', {
        title: 'Parcels | SendIT',
        path: '../../../../../',
        apiVersion: 'api/v1',
        user: ssn.user ? ssn.user : null,
        error: true,
      });
    }
  } else {
    res.render('v1/create_order', {
      title: 'Parcels | SendIT',
      path: '../../../../../',
      apiVersion: 'api/v1',
      user: ssn.user ? ssn.user : null,
    });
  }
});

// Fetch all created parcel delivery orders of a specific user
router.get('/:id/parcels/created', (req, res) => {
  ssn = req.session;
  const parcels = {};

  if (ssn.parcels && req.params.id) {
    Object.keys(ssn.parcels).forEach((key) => {
      if (ssn.parcels[key].sender.id === ssn.user.id && ssn.parcels[key].status === 'Unprocessed') {
        parcels[key] = ssn.parcels[key];
      }
    });
  }

  res.render('v1/created_orders', {
    title: 'Parcels | SendIT',
    path: '../../../../../',
    apiVersion: 'api/v1',
    user: ssn.user ? ssn.user : null,
    parcels,
  });
});

// Fetch all parcels in transit of a specific user
router.get('/:id/parcels/in-transit', (req, res) => {
  ssn = req.session;
  const parcels = {};

  if (ssn.parcels && req.params.id) {
    Object.keys(ssn.parcels).forEach((key) => {
      if (ssn.parcels[key].sender.id === ssn.user.id && ssn.parcels[key].status === 'In transit') {
        parcels[key] = ssn.parcels[key];
      }
    });
  }

  res.render('v1/parcels_in_transit', {
    title: 'Parcels | SendIT',
    path: '../../../../../',
    apiVersion: 'api/v1',
    user: ssn.user ? ssn.user : null,
    parcels,
  });
});

// Fetch all delivered parcel orders of a specific user
router.get('/:id/parcels/delivered', (req, res) => {
  ssn = req.session;
  const parcels = {};

  if (ssn.parcels && req.params.id) {
    Object.keys(ssn.parcels).forEach((key) => {
      if (ssn.parcels[key].sender.id === ssn.user.id && ssn.parcels[key].status === 'Delivered') {
        parcels[key] = ssn.parcels[key];
      }
    });
  }

  res.render('v1/delivered_parcels', {
    title: 'Parcels | SendIT',
    path: '../../../../../',
    apiVersion: 'api/v1',
    user: ssn.user ? ssn.user : null,
    parcels,
  });
});

// Fetch a specific parcel delivery oder of a specific user
router.get('/:id/parcels/:p_id', (req, res) => {
  ssn = req.session;
  let parcel = {};

  if (ssn.parcels && req.params.id) {
    Object.keys(ssn.parcels).forEach((key) => {
      if (ssn.parcels[key].orderId === req.params.p_id) {
        parcel = ssn.parcels[key];

        res.render('v1/order_details', {
          title: 'Parcels | SendIT',
          path: '../../../../../',
          apiVersion: 'api/v1',
          user: ssn.user ? ssn.user : null,
          parcel,
        });
      }
    });
  }

  res.redirect(`/api/v1/users/${req.params.id}/parcels`);
});

// Cancel a specific parcel delivery order of a specific user
router.get('/:id/parcels/:p_id/cancel', (req, res) => {
  ssn = req.session;

  if (ssn.parcels && req.params.id) {
    Object.keys(ssn.parcels).forEach((key) => {
      if (ssn.parcels[key].orderId === req.params.p_id) {
        delete ssn.parcels[key];
        res.redirect('back');
      }
    });
  }
});

// Change a specific parcel delivery order of a specific user
router.all('/:id/parcels/:p_id/change', (req, res) => {
  ssn = req.session;
  let parcel = {};

  if (ssn.parcels && req.params.id) {
    if (req.method === 'POST') {
      Object.keys(ssn.parcels).forEach((key) => {
        if (ssn.parcels[key].orderId === req.params.p_id) {
          if (req.body.new_country) {
            ssn.parcels[key].receiver.country = req.body.new_country;
          }
          if (req.body.new_city) {
            ssn.parcels[key].receiver.city = req.body.new_city;
          }
          if (req.body.new_address) {
            ssn.parcels[key].receiver.address = req.body.new_address;
          }

          parcel = ssn.parcels[key];

          res.render('v1/change_order', {
            title: 'Parcels | SendIT',
            path: '../../../../../../',
            apiVersion: 'api/v1',
            user: ssn.user ? ssn.user : null,
            parcel,
            changed: true,
          });
        }
      });
    } else {
      Object.keys(ssn.parcels).forEach((key) => {
        if (ssn.parcels[key].orderId === req.params.p_id) {
          parcel = ssn.parcels[key];

          res.render('v1/change_order', {
            title: 'Parcels | SendIT',
            path: '../../../../../../',
            apiVersion: 'api/v1',
            user: ssn.user ? ssn.user : null,
            parcel,
          });
        }
      });
    }
  }

  res.redirect(`/api/v1/users/${req.params.id}/parcels`);
});

export default router;
