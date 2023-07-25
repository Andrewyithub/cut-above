const express = require('express');
const router = express.Router();
const userRouter = require('../controllers/user');
const middleware = require('../utils/middleware');

router
  .route('/')
  .get(middleware.verifyJWT, userRouter.getAllUsers)
  .delete(middleware.verifyJWT, userRouter.removeUserData);

module.exports = router;
