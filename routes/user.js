const express = require('express');
const router = express.Router();
const userRouter = require('../controllers/user');

router.route('/').get(userRouter.getAllUsers).delete(userRouter.removeUserData);

module.exports = router;
