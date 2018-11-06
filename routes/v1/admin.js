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

  res.render('v1/admin', {
    title: 'Admin | SendIT',
    path: '../../../',
    apiVersion: 'api/v1',
    admin: true,
  });
});

export default router;
