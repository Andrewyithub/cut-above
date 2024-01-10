const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const { sampleUsers } = require('../seeds/users');
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const Schedule = require('../models/Schedule');
const helper = require('./test_helper');

beforeEach(async () => {
  await User.deleteMany();
  await User.insertMany(helper.users);
  await Appointment.deleteMany();
  await Schedule.deleteMany();
  await helper.createSchedules(helper.schedules);
  await helper.createAppointment(helper.users[1], helper.appointments[0]);
});

test('schedules created', async () => {
  const schedules = await Schedule.find();
  expect(schedules).toHaveLength(4);
});

// formattedDate, modifiedAppt
// create appointment
// add to schedule
// modifyScheduledAppt(formattedData, modifiedAPpointment)
