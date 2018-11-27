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

// sign-in
router.post('/signin', async (req, res) => {
  ssn = req.session;
  const admin = new Admin();
  const account = await admin.signin(req.body);

  if (!admin.error) {
    ssn.admin = account;
    return res.status(202).json({
      status: 'Successfull',
      message: `Welcome ${ssn.admin.fname} ${ssn.admin.lname}`,
      admin: ssn.admin,
    });
  }
  
  return res.status(200).json({
    error: admin.error,
  });
});

export default router;