import fs from 'fs';
import express from 'express';
import session from 'express-session';
import Admin from '../../controllers/Admin';

let ssn;
const router = express.Router();

router.use(session({
  secret: 'rwajon@sendit',
  resave: true,
  saveUninitialized: true,
}));

// signin
router.all('/signin', (req, res) => {
  ssn = req.session;

  if (req.method === 'POST') {
    ssn.admins = JSON.parse(fs.readFileSync('src/models/admins.json'));
    const admin = new Admin(ssn.admins);
    const account = admin.signin(req.body);

    if (!admin.error) {
      ssn.admin = account;
      res.send({
        admin: ssn.admin,
      });
    }

    ssn.admin = ssn.admin || false;

    res.send({
      error: admin.error,
    });
  } else {
    res.send('Please, sign-in!');
  }
});

export default router;
