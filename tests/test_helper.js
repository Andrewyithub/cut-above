const bcrypt = require('bcrypt');
const userRepo = require('../repositories/userRepository');
const scheduleRepo = require('../repositories/scheduleRepository');
const appointmentRepo = require('../repositories/appointmentRepository');
const { formatApptData } = require('../services/appointmentServices');
const User = require('../models/User');

const appointments = [
  {
    date: '2024-01-05',
    start: '17:30',
    end: '18:00',
    service: 'Haircut',
    // employee: 'object_id',
    // user: 'object_id'
  },
  {
    date: '2024-01-06',
    start: '11:30',
    end: '11:45',
    service: 'Beard Trim',
    // employee: 'object_id',
    // user: 'object_id'
  },
  {
    date: '2024-01-07',
    start: '15:00',
    end: '15:45',
    service: 'Cut and Shave Package',
    // employee: 'object_id',
    // user: 'object_id'
  },
  {
    date: '2024-01-11',
    start: '16:30',
    end: '17:30',
    service: 'The Full Package',
    // employee: 'object_id',
    // user: 'object_id'
  },
  {
    date: '2024-01-11',
    start: '12:30',
    end: '13:00',
    service: 'Haircut',
    // employee: 'object_id',
    // user: 'object_id'
  },
];

const users = [
  {
    firstName: 'John',
    lastName: 'Clark',
    email: 'John@cut_above_client.com',
    passwordHash: bcrypt.hashSync('password', 10),
    role: 'client',
  },
  {
    firstName: 'Jane',
    lastName: 'Emerson',
    email: 'Jane@cut_above_employee.com',
    passwordHash: bcrypt.hashSync('password', 10),
    role: 'employee',
  },
  {
    firstName: 'Frank',
    lastName: 'Esteban',
    email: 'Frank@cut_above_employee.com',
    passwordHash: bcrypt.hashSync('password', 10),
    role: 'employee',
  },
];

// Front end request body is a dayjs object: dayjs(value), for each of these items
const schedules = [
  {
    date: '2024-01-05T05:00:00.000Z',
    open: '2024-01-05T15:00:00.000Z',
    close: '2024-01-05T23:00:00.000Z',
  },
  {
    date: '2024-01-06T05:00:00.000Z',
    open: '2024-01-06T15:00:00.000Z',
    close: '2024-01-06T23:00:00.000Z',
  },
  {
    date: '2024-01-07T05:00:00.000Z',
    open: '2024-01-07T15:00:00.000Z',
    close: '2024-01-07T23:00:00.000Z',
  },
  {
    date: '2024-01-10T05:00:00.000Z',
    open: '2024-01-10T15:00:00.000Z',
    close: '2024-01-10T23:00:00.000Z',
  },
];

const createUser = async (user) => {
  return await userRepo.create(user);
};

const createUsers = async () => {
  return await User.insertMany(users);
};

const createSchedules = async (schedules) => {
  return await scheduleRepo.create(schedules);
};

const createAppointment = async (employee, appointment) => {
  const client = await User.findOne({ firstName: users[0].firstName });
  const employeeToBook = await User.findOne({ firstName: employee.firstName });
  const formattedData = await formatApptData({
    ...appointment,
    user: client,
    employee: employeeToBook,
  });
  return await appointmentRepo.create(formattedData);
};

module.exports = {
  appointments,
  users,
  schedules,
  createUser,
  createUsers,
  createSchedules,
  createAppointment,
};
