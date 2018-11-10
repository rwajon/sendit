import fs from 'fs';
import express from 'express';
import session from 'express-session';
import Admin from '../private/Admin';

let ssn;
const router = express.Router();

router.use(session({
  secret: 'rwajon@sendit',
  resave: true,
  saveUninitialized: true,
}));

router.get('/', (req, res) => {
  ssn = req.session;

  if (!ssn.admin) {
    res.redirect('/admins/signin');
  }

  res.render('admins', {
    title: 'Admin | SendIT',
    path: '../',
    admin: true,
  });
});

// signin
router.all('/signin', (req, res) => {
  ssn = req.session;

  if (req.method === 'POST') {
    ssn.admins = JSON.parse(fs.readFileSync('private/admins.json'));
    const admin = new Admin(ssn.admins);
    const account = admin.signin(req.body);

    if (!admin.error) {
      ssn.admin = account;
      res.redirect('/admins');
    }

    ssn.admin = ssn.admin || false;

    res.render('admin_signin', {
      title: 'Sign-in | SendIT',
      path: '../',
      admin: ssn.admin,
      error: admin.error,
    });
  } else {
    res.render('admin_signin', {
      title: 'Sign-in | SendIT',
      path: '../',
      admin: ssn.admin || false,
    });
  }
});

export default router;
