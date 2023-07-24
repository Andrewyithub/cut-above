const express = require('express');
const router = express.Router();
const appointmentRouter = require('../controllers/appointment');

router
  .route('/')
  .get(appointmentRouter.getAllAppointments)
  .post(appointmentRouter.createNewAppointment);

router
  .route('/:id')
  .put(appointmentRouter.updateAppointment)
  .delete(appointmentRouter.cancelAppointment);

module.exports = router;
