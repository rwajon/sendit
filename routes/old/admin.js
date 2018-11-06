import express from 'express';
// import session from 'express-session';

// let ssn;
const router = express.Router();

/* router.use(session({
  secret: 'rwajon@sendit',
  resave: true,
  saveUninitialized: true,
})); */

router.get('/', (req, res) => {
  // ssn = req.session;

  res.render('admin', {
    title: 'Admin | SendIT',
    path: '../',
    admin: true,
  });
});

export default router;
