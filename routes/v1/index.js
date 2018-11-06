import express from 'express';
import session from 'express-session';

let ssn;
const router = express.Router();

router.use(session({
  secret: 'rwajon@sendit',
  resave: true,
  saveUninitialized: true,
}));

/* GET home page. */
router.get('/', (req, res) => {
  ssn = req.session;

  res.render('v1/index', {
    title: 'Home | SendIT',
    path: '',
    apiVersion: 'api/v1',
    user: ssn.user ? ssn.user : null,
  });
});

export default router;
