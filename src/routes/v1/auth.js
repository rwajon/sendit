import fs from 'fs';
import express from 'express';
import User from '../../controllers/User';

let ssn;
const router = express.Router();

// sign-up
router.post('/signup', async (req, res) => {
  ssn = req.session;
  const user = new User();
  const newUser = await user.signup(req.body);

  if (!user.error) {
    ssn.user = newUser;
    return res.status(201).json({
      status: 'Successful',
      newUser,
    });
  }

  return res.status(200).json({
    error: user.error,
  });

});

// sign-in
router.post('/signin', async (req, res) => {
  ssn = req.session;
  const user = new User();
  const account = await user.signin(req.body);

  if (!user.error) {
    ssn.user = account;
    return res.status(202).json({
      status: 'Successfull',
      message: `Welcome ${ssn.user.fname} ${ssn.user.lname}`,
      user: ssn.user,
    });
  }
  
  return res.status(200).json({
    error: user.error,
  });
});

export default router;