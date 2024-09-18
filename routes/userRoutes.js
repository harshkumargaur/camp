const express = require('express');
const router = express.Router();

const { userSignUp, userLogin } = require('./../controllers/userController');

router.post('/signup', async (req, res, next) => {
  userSignUp(req, res, next);
});

router.post('/login', async (req, res, next) => {
  userLogin(req, res, next);
});

// router.get('/', async (req, res, next) => {
//   console.log('entered');
// });

// router.get('/', async (req, res, next) => {
//   console.log('entered');
// });

// router.get('/', async (req, res, next) => {
//   console.log('entered');
// });

module.exports = router;
