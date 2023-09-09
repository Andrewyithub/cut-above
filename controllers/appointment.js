const mongoose = require('mongoose');
const Appointment = require('../models/Appointment');
const Schedule = require('../models/Schedule');
const User = require('../models/User');
const dateServices = require('../utils/date');
const emailServices = require('../utils/email');
const AppError = require('../utils/AppError');

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
  const emailId = emailServices.generateEmailId();
  const formattedStart = dateServices.easternDateTime(date, start);
  const newAppt = new Appointment({
    date: dateServices.easternDate(date),
    start: formattedStart,
    end: dateServices.easternDateTime(date, end),
    service,
    client,
    employee: employeeToBook,
    emailId,
  });
  // Validate availability
  const schedule = await Schedule.findOne({
    date: dateServices.easternDate(date),
  }).populate('appointments', 'start end employee');
  const open = dateServices.checkAvailability(schedule, newAppt);
  if (!open) {
    throw new AppError(500, 'Time slot no longer available');
  }
  await newAppt.save({ session });
  // Add to schedule
  schedule.appointments.push(newAppt);
  await schedule.save({ session });
  // Send confirmation
  // const emailSent = await emailServices.sendEmail({
  //   receiver: client.email,
  //   employee: employeeToBook.firstName,
  //   date: dateServices.formatDateSlash(date),
  //   time: dateServices.formatTime(formattedStart),
  //   option: 'confirmation',
  //   emailLink: `https://cutaboveshop.fly.dev/appointment/${emailId}`,
  // });
  await session.commitTransaction();
  res.status(201).json({
    success: true,
    message: 'Appointment booked successfully',
  });
  session.endSession();
};

module.exports = bookAppointment;

const bookAppointmentV1 = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // Create new appointment
    const { date, start, end, service, employee } = req.body;
    const client = await User.findOne({ _id: req.user });
    const employeeToBook = await User.findOne({ _id: employee });
    const emailId = emailServices.generateEmailId();
    const formattedStart = dateServices.easternDateTime(date, start);
    const newAppt = new Appointment({
      date: dateServices.easternDate(date),
      start: formattedStart,
      end: dateServices.easternDateTime(date, end),
      service,
      client,
      employee: employeeToBook,
      emailId,
    });
    // Validate availability
    const schedule = await Schedule.findOne({
      date: dateServices.easternDate(date),
    }).populate('appointments', 'start end employee');
    const open = dateServices.checkAvailability(schedule, newAppt);
    if (!open) {
      return res.status(500).json({ error: 'Time slot no longer available' });
    }
    await newAppt.save({ session });

    // Add to schedule
    schedule.appointments.push(newAppt);
    await schedule.save({ session });

    // Send confirmation
    const emailSent = await emailServices.sendEmail({
      receiver: client.email,
      employee: employeeToBook.firstName,
      date: dateServices.formatDateSlash(date),
      time: dateServices.formatTime(formattedStart),
      option: 'confirmation',
      emailLink: `https://cutaboveshop.fly.dev/appointment/${emailId}`,
    });

    await session.commitTransaction();
    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
    });
  } catch (err) {
    await session.abortTransaction();
    throw new AppError(500, 'Failed to book appointment.');
  } finally {
    session.endSession();
  }
};
//

const modifyAppointment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // const appointment = await Appointment.findById(req.params.id);
    // if (req.body.status) appointment.status = req.body.status;
    // await appointment.save({ session });
    // await session.commitTransaction();
    // res.status(200).json({
    //   success: true,
    //   message: 'Appointment updated',
    // });
    const appointment = await Appointment.findById(req.params.id, null, {
      session,
    });
    console.log('====================================');
    console.log(appointment);
    console.log('====================================');
    appointment.status = 'checked-in';

    await appointment.save({ session });

    await session.commitTransaction();
    res.status(200).json({
      success: true,
      message: 'Test worked',
    });
  } catch (err) {
    console.log(err);
    await session.abortTransaction();
    throw new AppError(500, 'Failed to update appointment');
  } finally {
    session.endSession();
  }
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
  // updateAppointmentStatus,
  cancelAppointment,
};

// const createNewAppointment = async (req, res) => {
//   const { date, start, end, service, employee } = req.body;
//   const clientToBook = await User.findOne({ _id: req.user });
//   const employeeToBook = await User.findOne({ _id: employee });
//   const newAppt = new Appointment({
//     date: dateServices.easternDate(date),
//     start: dateServices.easternDateTime(date, start),
//     end: dateServices.easternDateTime(date, end),
//     service,
//     client: clientToBook,
//     employee: employeeToBook,
//     emailId: email.generateEmailId(),
//   });
//   await newAppt.save();
//   res.status(201).json({
//     success: true,
//     message: 'Appointment successfully reserved',
//     data: newAppt,
//   });
// };

// const bookAppointment = async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();
//   try {
//     // Create new appointment
//     const { date, start, end, service, employee } = req.body;
//     const client = await User.findOne({ _id: req.user });
//     const employeeToBook = await User.findOne({ _id: employee });
//     const emailId = emailServices.generateEmailId();
//     const formattedStart = dateServices.easternDateTime(date, start);
//     const newAppt = new Appointment({
//       date: dateServices.easternDate(date),
//       start: formattedStart,
//       end: dateServices.easternDateTime(date, end),
//       service,
//       client,
//       employee: employeeToBook,
//       emailId,
//     });
//     // Validate availability
//     const schedule = await Schedule.findOne({
//       date: dateServices.easternDate(date),
//     }).populate('appointments', 'start end employee');
//     const open = dateServices.checkAvailability(schedule, newAppt);
//     if (!open) {
//       return res.status(500).json({ error: 'Time slot no longer available' });
//     }
//     await newAppt.save({ session });

//     // Add to schedule
//     schedule.appointments.push(newAppt);
//     await schedule.save({ session });

//     // Send confirmation
//     const emailSent = await emailServices.sendEmail({
//       receiver: client.email,
//       employee: employeeToBook.firstName,
//       date: dateServices.formatDateSlash(date),
//       time: dateServices.formatTime(formattedStart),
//       option: 'confirmation',
//       emailLink: `https://cutaboveshop.fly.dev/appointment/${emailId}`,
//     });

//     await session.commitTransaction();
//     res.status(201).json({
//       success: true,
//       message: 'Appointment booked successfully',
//     });
//   } catch (err) {
//     await session.abortTransaction();
//     throw new AppError(500, 'Failed to book appointment.');
//   } finally {
//     session.endSession();
//   }
// };
