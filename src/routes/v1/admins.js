import express from 'express';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import Admin from '../../controllers/Admin';

const router = express.Router();

dotenv.config();

// sign-up
router.post('/signup', async (req, res) => {
  const admin = new Admin();
  const newAdmin = await admin.signup(req.body);

  if (!admin.error) {
    const token = jwt.sign({ adminId: newAdmin.id }, process.env.SECRET_KEY, {
      expiresIn: 1440, // expires in 24 hours
    });

    return res.status(201).json({
      status: 'Successful',
      message: `Welcome ${newAdmin.fname} ${newAdmin.lname}`,
      newAdmin,
      token,
    });
  }

  return res.status(200).json({
    error: admin.error,
  });
});

// login
router.post('/login', async (req, res) => {
  const admin = new Admin();
  const account = await admin.login(req.body);

  if (!admin.error) {
    const token = jwt.sign({ adminId: account.id }, process.env.SECRET_KEY, {
      expiresIn: 1440, // expires in 24 hours
    });

    return res.status(202).json({
      status: 'Successfull',
      message: `Welcome ${account.fname} ${account.lname}`,
      admin: account,
      token,
    });
  }

  return res.status(200).json({
    error: admin.error,
  });
});

export default router;
