const Appointment = require('../models/Appointment');
const Schedule = require('../models/Schedule');
const User = require('../models/User');
const dateServices = require('../utils/date');
const email = require('../utils/email');

const getAllAppointments = async (req, res) => {
  const appointments = await Appointment.find({
    $or: [{ client: req.user }, { employee: req.user }],
  });
  res.status(200).json(appointments);
};

const getOneAppointment = async (req, res) => {
  const appointment = await Appointment.findOne({
    // _id: req.params.id,
    emailId: req.params.id,
  });
  // .populate('employee', 'firstName');
  res.status(200).json(appointment);
};

const createNewAppointment = async (req, res) => {
  const { date, start, end, service, employee } = req.body;
  const clientToBook = await User.findOne({ _id: req.user });
  const employeeToBook = await User.findOne({ _id: employee });
  const newAppt = new Appointment({
    date: dateServices.easternDate(date),
    start: dateServices.easternDateTime(date, start),
    end: dateServices.easternDateTime(date, end),
    service,
    client: clientToBook,
    employee: employeeToBook,
    emailId: email.generateEmailId(),
  });
  await newAppt.save();
  res.status(201).json({
    success: true,
    message: 'Appointment successfully reserved',
    data: newAppt,
  });
};

const updateAppointment = async (req, res) => {
  const updatedAppointment = await Appointment.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true, context: 'query' }
  );
  res.status(200).json({
    success: true,
    message: 'Appointment successfully updated',
    data: updatedAppointment,
  });
};

const cancelAppointment = async (req, res) => {
  const { date, employee, start } = await Appointment.findByIdAndDelete(
    req.params.id
  );
  const scheduleToUpdate = await Schedule.findOne({ date });
  const index = scheduleToUpdate.appointments.findIndex(
    (appt) => appt._id.toString() === req.params.id
  );
  scheduleToUpdate.appointments.splice(index, 1);
  await scheduleToUpdate.save();

  res.status(200).json({
    success: true,
    data: { date, employee, start },
    message: 'Appointment successfully cancelled',
  });
};

module.exports = {
  getAllAppointments,
  getOneAppointment,
  createNewAppointment,
  updateAppointment,
  cancelAppointment,
};
