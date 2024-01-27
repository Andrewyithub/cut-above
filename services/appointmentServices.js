const {
  getAll,
  getOne,
  create,
  modify,
  updateStatus,
} = require('../repositories/appointmentRepository');
const {
  addAppointment,
  findByDate,
  findByApptId,
} = require('../repositories/scheduleRepository');
const { findById } = require('../repositories/userRepository');
const { modifyScheduledAppts } = require('../services/scheduleServices');
const { formatData } = require('../utils/database');
const AppError = require('../utils/AppError');
const { checkAvailability } = require('../utils/date');

const getAllAppointments = () => getAll();
const getOneAppointment = () => getOne();

// Example dateObj = {
//   date: '2023-12-24T05:00:00.000Z',
//   start: '2023-12-24T15:00:00.000Z',
//   end: '2023-12-24T15:30:00.000Z',
// }
// returns = {
//   date: '2023-12-24T05:00:00.000Z', // dayjs obj
//   start: '2023-12-24T15:00:00.000Z', // dayjs obj
//   end: '2023-12-24T15:30:00.000Z', // dayjs obj
//   service: 'Haircut',
//   client: 'mongodb_object_id'
//   employee: 'mongodb_object_id'
//   emailId: 'c6d6d7bd-a17a-4924-a48b-241cd8bcc3c5"
// }
const formatApptData = async (apptData) => {
  const { id, date, start, end, service, user, employee } = apptData;
  const client = await findById(user);
  const employeeToBook = await findById(employee);
  const formattedData = formatData(date, start, end);
  return { ...formattedData, id, service, client, employee: employeeToBook };
};

const isAvailableAppointment = async (dateObj) => {
  const schedule = await findByDate(dateObj.date);
  if (!schedule) {
    throw new AppError(500, 'isAvailableAppointment no schedule found');
  }
  const isAvailable = checkAvailability(schedule, dateObj);
  if (!isAvailable) {
    throw new AppError(500, 'Time slot no longer available');
  } else {
    return isAvailable;
  }
};

// Example apptData = {
//   date: '2024-01-10',
//   start: '17:30',
//   end: '18:00',
//   service: 'Haircut',
//   employee: 'employee_object_id_string'
//   user: "objectId_string_from_req.user"
// }

const bookAppointment = async (apptData) => {
  const formattedData = await formatApptData(apptData);
  await isAvailableAppointment(formattedData);
  const newAppt = await create(formattedData);
  const scheduleToModify = await findByDate(formattedData.date);
  await addAppointment(scheduleToModify, newAppt);
  return newAppt;
  // create jwt
  // send email
};

const modifyAppointment = async (apptData) => {
  const formattedData = await formatApptData(apptData);
  await isAvailableAppointment(formattedData);
  const modifiedAppointment = await modify(formattedData);
  await modifyScheduledAppts(formattedData, modifiedAppointment);
  return modifiedAppointment;
  // create jwt
  // send email
};

const updateAppointmentStatus = async (apptData) => {
  return await updateStatus(apptData);
};

module.exports = {
  formatApptData,
  getAllAppointments,
  getOneAppointment,
  isAvailableAppointment,
  bookAppointment,
  modifyAppointment,
  updateAppointmentStatus,
};
