const appointmentRouter = require('express').Router();
const Appointment = require('../models/Appointment');
const Schedule = require('../models/Schedule');
const User = require('../models/User');
const dateServices = require('../utils/date');
const dayjs = require('dayjs');

appointmentRouter.get('/', async (req, res) => {
  const appointments = await Appointment.find({
    $or: [{ client: req.user }, { employee: req.user }],
  });
  res.status(200).json(appointments);
});

appointmentRouter.post('/', async (req, res) => {
  const { date, start, end, service, employee } = req.body;
  const clientToBook = await User.findOne({ _id: req.user });
  const employeeToBook = await User.findOne({ _id: employee });
  const newAppt = new Appointment({
    date: dateServices.convertToEST(date),
    start,
    end,
    service,
    client: clientToBook,
    employee: employeeToBook,
  });
  await newAppt.save();
  res.status(201).json({
    success: true,
    message: 'Appointment successfully reserved',
    data: newAppt,
  });
});

appointmentRouter.delete('/:id', async (req, res) => {
  console.log('req.body', req.body);
  const { employee, date } = await Appointment.findByIdAndDelete(req.params.id);
  console.log('employee: ', employee);
  console.log('date: ', date);
  const scheduleToUpdate = await Schedule.findOne({ date });
  console.log('scheduleToUpdate', scheduleToUpdate);
  const index = scheduleToUpdate.appointments.findIndex(
    (appt) => appt._id.toString() === req.params.id
  );
  scheduleToUpdate.appointments.splice(index, 1);
  // scheduleToUpdate.available.push(employee);
  await scheduleToUpdate.save();

  res.status(200).json({
    success: true,
    message: 'Appointment successfully cancelled',
  });
});

module.exports = appointmentRouter;
