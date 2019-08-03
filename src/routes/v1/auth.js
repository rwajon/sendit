import express from 'express';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import User from '../../controllers/User';

const router = express.Router();

dotenv.config();

// sign-up
router.post('/signup', async (req, res) => {
  const user = new User();
  const newUser = await user.signup(req.body);

  if (!user.error) {
    const token = jwt.sign({ userId: newUser.id }, process.env.SECRET_KEY, {
      expiresIn: 86400, // expires in 24 hours
    });

    return res.status(201).json({
      status: 'Successful',
      message: `Welcome ${newUser.fname} ${newUser.lname}`,
      newUser,
      token,
    });
  }

  return res.status(500).json({
    error: user.error,
  });
});

// login
router.post('/login', async (req, res) => {
  const user = new User();
  const account = await user.login(req.body);

  if (!user.error) {
    const token = jwt.sign({ userId: account.id }, process.env.SECRET_KEY, {
      expiresIn: 86400, // expires in 24 hours
    });

    return res.status(202).json({
      message: `Welcome ${account.firstName} ${account.lastName}`,
      user: account,
      token,
    });
  }

  return res.status(500).json({
    error: user.error,
  });
});

export default router;
