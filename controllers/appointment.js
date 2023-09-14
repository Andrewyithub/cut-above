const mongoose = require('mongoose');
const Appointment = require('../models/Appointment');
const Schedule = require('../models/Schedule');
const User = require('../models/User');
const databaseServices = require('../utils/database');
const dateServices = require('../utils/date');
const emailServices = require('../utils/email');
const AppError = require('../utils/AppError');

const jwt = require('jsonwebtoken');
const dayjs = require('dayjs');

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

const bookAppointment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  req.session = session;

  // Create new appointment
  const { date, start, end, service, employee } = req.body;
  const client = await User.findOne({ _id: req.user });
  const employeeToBook = await User.findOne({ _id: employee });
  const formattedData = databaseServices.formatData(date, start, end);
  const newAppt = new Appointment({
    date: formattedData.date,
    start: formattedData.start,
    end: formattedData.end,
    service,
    client,
    employee: employeeToBook,
    emailId: formattedData.emailId,
  });

  // Validate availability
  const schedule = await Schedule.findOne({
    date: formattedData.date,
  }).populate('appointments', 'start end employee');
  const open = dateServices.checkAvailability(schedule, newAppt);
  if (!open) {
    throw new AppError(500, 'Time slot no longer available');
  }
  await newAppt.save({ session });

  // Add to schedule
  schedule.appointments.push(newAppt);
  await schedule.save({ session });

  // Creating user email token
  const appointmentDateTime = dayjs(formattedData.date);

  // Calculate expiration date
  const expirationDateTime = appointmentDateTime.subtract(2, 'day');
  const expiresInSec = dayjs().diff(expirationDateTime, 'second');

  const userEmailToken = jwt.sign(
    {
      id: client._id,
    },
    process.env.EMAIL_TOKEN_SECRET,
    { expiresIn: expiresInSec }
  );
  client.emailToken.push(userEmailToken);
  await client.save({ session });

  // Sending confirmation
  const emailSent = await emailServices.sendEmail({
    receiver: client.email,
    employee: employeeToBook.firstName,
    date: dateServices.formatDateSlash(formattedData.data),
    time: dateServices.formatTime(formattedData.start),
    option: 'confirmation',
    emailLink: `https://cutaboveshop.fly.dev/appointment/${formattedData.emailId}/?token=${userEmailToken}`,
  });

  await session.commitTransaction();
  res.status(201).json({
    success: true,
    message: 'Appointment booked successfully',
  });
  session.endSession();
};

const modifyAppointment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  req.session = session;

  // prepare modified appointment details
  const { date, start, end, service, employee } = req.body;
  const employeeToBook = await User.findOne({ _id: employee });
  const formattedData = databaseServices.formatData(date, start, end);

  const newAppointmentDetails = {
    date: formattedData.date,
    start: formattedData.start,
    end: formattedData.end,
    service,
    employee: employeeToBook,
    emailId: formattedData.emailId,
  };

  // validate date availability
  const newSchedule = await Schedule.findOne({
    date: formattedData.date,
  }).populate('appointments', 'start end employee');
  const open = dateServices.checkAvailability(
    newSchedule,
    newAppointmentDetails
  );
  if (!open) {
    throw new AppError(500, 'Time slot no longer available');
  }
  const modifiedAppointment = await Appointment.findByIdAndUpdate(
    req.params.id,
    newAppointmentDetails,
    {
      new: true,
      runValidators: true,
      context: 'query',
      session: session,
    }
  );

  // add modified appointment to schedule
  const prevSchedule = await Schedule.findOne({
    appointments: req.params.id,
  });
  const scheduledAppointments = [...prevSchedule.appointments];
  const updatedAppointmentIndex = scheduledAppointments.findIndex(
    (appointmentId) => appointmentId.toString() === req.params.id
  );
  if (
    req.body.date &&
    new Date(formattedData.date).getTime() !==
      new Date(prevSchedule.date).getTime()
  ) {
    //  add to new schedule
    newSchedule.appointments.push(modifiedAppointment);
    await newSchedule.save({ session });
    //  remove from old schedule
    scheduledAppointments.splice(updatedAppointmentIndex, 1);
  } else {
    // date has not changed, update old schedule's information
    scheduledAppointments.splice(
      updatedAppointmentIndex,
      1,
      modifiedAppointment
    );
  }
  prevSchedule.appointments = scheduledAppointments;
  await prevSchedule.save({ session });

  // send confirmation email
  console.log('====================================');
  console.log('sending confirmation email');
  console.log('====================================');

  res.status(200).json({
    success: true,
    message: 'Appointment successfully updated',
  });
  await session.commitTransaction();
  session.endSession();
};

const updateAppointmentStatus = async (req, res) => {
  const updatedAppointment = await Appointment.updateOne(
    { _id: req.params.id },
    { $set: { status: req.body.status } }
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
  bookAppointment,
  modifyAppointment,
  // createNewAppointment,
  updateAppointmentStatus,
  cancelAppointment,
};
