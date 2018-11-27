import fs from 'fs';
import express from 'express';
import Admin from '../../controllers/Admin';

let ssn;
const router = express.Router();

// sign-up
router.post('/signup', async (req, res) => {
  ssn = req.session;
  const admin = new Admin();
  const newAdmin = await admin.signup(req.body);

  if (!admin.error) {
    ssn.admin = newAdmin;
    return res.status(201).json({
      status: 'Successful',
      newAdmin,
    });
  }

  return res.status(200).json({
    error: admin.error,
  });

});

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