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
router.post('/signin', (req, res) => {
  ssn = req.session;
  ssn.admins = JSON.parse(fs.readFileSync('src/models/admins.json'));
  const admin = new Admin(ssn.admins);
  const account = admin.signin(req.body);


  if (!admin.error) {
    ssn.admin = account;
    return res.status(200).json({
      status: 'Successfull',
      message: `Welcome ${ssn.admin.uname}`,
      admin: ssn.admin,
    });
  }

  return res.json({
    error: admin.error,
  });
});

export default router;