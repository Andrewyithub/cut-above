const express = require('express');
const router = express.Router();
const registerRouter = require('../controllers/register');

router.get('/', registerRouter.handleRegister);

module.exports = router;
