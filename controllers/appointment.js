const appointmentRouter = require('express').Router();

appointmentRouter.get('/', async (req, res) => {
  const appointment = [{ id: 1, date: '10/08/2023', title: 'Airport' }];
  res.status(200).json(appointment);
});

module.exports = appointmentRouter;
