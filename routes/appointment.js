const express = require('express');
const router = express.Router();
const appointmentRouter = require('../controllers/appointment');
const middleware = require('../utils/middleware');

router
  .route('/')
  .get(middleware.verifyJWT, appointmentRouter.getAllAppointments)
  .post(middleware.verifyJWT, appointmentRouter.createNewAppointment);

router
  .route('/:id')
  .put(middleware.verifyJWT, appointmentRouter.updateAppointment)
  .delete(middleware.verifyJWT, appointmentRouter.cancelAppointment);

module.exports = router;
