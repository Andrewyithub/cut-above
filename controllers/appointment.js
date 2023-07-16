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
  const formattedDate = dateServices.convertToEST(date);
  const newAppt = new Appointment({
    date: formattedDate,
    start: dateServices.convertToEstTime(formattedDate, start),
    end: dateServices.convertToEstTime(formattedDate, end),
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

appointmentRouter.put('/:id', async (req, res) => {
  const updatedAppointment = await Appointment.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true, context: 'query' }
  );
  res.status(200).json({
    success: true,
    message: 'Appointment successfully reserved',
    data: updatedAppointment,
  });
});

appointmentRouter.delete('/:id', async (req, res) => {
  const { employee, date } = await Appointment.findByIdAndDelete(req.params.id);
  const scheduleToUpdate = await Schedule.findOne({ date });
  const index = scheduleToUpdate.appointments.findIndex(
    (appt) => appt._id.toString() === req.params.id
  );
  scheduleToUpdate.appointments.splice(index, 1);
  await scheduleToUpdate.save();

  res.status(200).json({
    success: true,
    message: 'Appointment successfully cancelled',
  });
});

module.exports = appointmentRouter;
