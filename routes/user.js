const express = require('express');
const router = express.Router();
const userRouter = require('../controllers/user');

router.get('/', userRouter.getAllUsers);
router.delete('/', userRouter.deleteUserData);

module.exports = router;
