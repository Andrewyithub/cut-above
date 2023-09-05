const express = require('express');
const router = express.Router();
const userRouter = require('../controllers/user');
const middleware = require('../utils/middleware');

router
  .route('/')
  .get(middleware.verifyJWT, userRouter.getAllUsers)
  .put(middleware.verifyJWT, userRouter.changeEmail)
  .delete(middleware.verifyJWT, userRouter.removeUserData);

router.route('/email').put(middleware.verifyJWT, userRouter.changeEmail);
router.route('/password').put(middleware.verifyJWT, userRouter.changePassword);
router.route('/validate-token').get(userRouter.validateToken)
router.route('/resetpw').post(userRouter.resetPassword)

module.exports = router;
