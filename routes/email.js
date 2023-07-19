const express = require('express');
const router = express.Router();
const emailRouter = require('../controllers/email');

router.post('/confirmation', emailRouter.handleConfirmation);
router.post('/modification', emailRouter.handleModification);
router.post('/cancellation', emailRouter.handleCancellation);

module.exports = router;
