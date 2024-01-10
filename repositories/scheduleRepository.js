const Schedule = require('../models/Schedule');

// get all schedules
const getAll = async () => {
  return await Schedule.find({}).populate(
    'appointments',
    'start end client employee service status'
  );
};

const findById = async (id) => {
  return await Schedule.findById(id);
};

const findByDate = async (date) => {
  return await Schedule.findOne({ date }).populate(
    'appointments',
    'start end employee'
  );
};

const findByApptId = async (id) => {
  return await Schedule.findOne({ appointments: id });
};

// create one or multiple schedules
const create = async (scheduleData) => {
  return await Schedule.create(scheduleData);
};

// validate availability

const remove = async (id) => {
  return await Schedule.findByIdAndDelete(id);
};

// add appointment to schedule
const addAppointment = async (schedule, apptObj) => {
  schedule.appointments.push(apptObj);
  await schedule.save();
  return schedule;
};

// remove appointment from schedule
const removeAppointment = async (apptId, schedule) => {
  const index = schedule.appointments.findIndex(
    (appt) => appt._id.toString() === apptId
  );
  schedule.appointments.splice(index, 1);
  await schedule.save();
  return schedule;
};

const updateAppointment = async (apptId, schedule, newAppt) => {
  const index = schedule.appointments.findIndex(
    (appt) => appt._id.toString() === apptId
  );
  schedule.appointments.splice(index, 1, newAppt);
  await schedule.save();
  return schedule;
};

module.exports = {
  getAll,
  findById,
  findByDate,
  findByApptId,
  create,
  remove,
  addAppointment,
  removeAppointment,
  updateAppointment,
};
