const express = require('express');
const router = express.Router();
const appointmentRouter = require('../controllers/appointment');
const middleware = require('../utils/middleware');

router
  .route('/')
  .get(middleware.verifyJWT, appointmentRouter.getAllAppointments)
  .post(middleware.verifyJWT, appointmentRouter.bookAppointment);

router
  .route('/:id')
  .get(appointmentRouter.getOneAppointment)
  .put(middleware.verifyJWT, appointmentRouter.modifyAppointment)
  .delete(middleware.verifyJWT, appointmentRouter.cancelAppointment);

module.exports = router;
