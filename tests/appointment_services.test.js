const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const Schedule = require('../models/Schedule');
const helper = require('./test_helper');
const {
  bookAppointment,
  modifyAppointment,
} = require('../services/appointmentServices');
const { findByDate } = require('../repositories/scheduleRepository');

beforeEach(async () => {
  await User.deleteMany();
  await User.insertMany(helper.users);
  await Appointment.deleteMany();
  await Schedule.deleteMany();
  await helper.createSchedules(helper.schedules);
});

test('booking an appointment through services', async () => {
  const client = await User.findOne({ firstName: helper.users[0].firstName });
  const employee = await User.findOne({
    firstName: helper.users[1].firstName,
  });
  await bookAppointment({
    ...helper.appointments[0],
    user: client,
    employee,
  });
  const appointments = await Appointment.find();
  expect(appointments).toHaveLength(1);
  const bookedSchedule = await findByDate(helper.schedules[0].date);
  expect(bookedSchedule.appointments).toHaveLength(1);
});

test('modifying an appointment through services', async () => {
  const client = await User.findOne({ firstName: helper.users[0].firstName });
  const employee = await User.findOne({
    firstName: helper.users[1].firstName,
  });
  const bookedAppt = await bookAppointment({
    ...helper.appointments[0],
    user: client,
    employee,
  });
  const newEmployee = await User.findOne({
    firstName: helper.users[2].firstName,
  });
  const newApptData = {
    id: bookedAppt._id,
    ...helper.appointments[1],
    user: client,
    employee: newEmployee,
  };
  const modifiedAppointment = await modifyAppointment(newApptData);
  const appointments = await Appointment.find();
  const prevSchedule = await findByDate(bookedAppt.date);
  expect(prevSchedule.appointments).toHaveLength(0);
  expect(appointments[0].service).toBe('Beard Trim');
  const modifiedSchedule = await findByDate(modifiedAppointment.date);
  expect(modifiedSchedule.appointments).toHaveLength(1);
  expect(appointments[0].employee._id).toEqual(newEmployee._id);
  expect(new Date(appointments[0].date).toISOString()).toBe(
    new Date(helper.schedules[1].date).toISOString()
  );
});

describe('updating an appointment status', () => {
  test('through services', async () => {
    const Appointment = require('../models/Appointment');
    jest.mock('../models/Appointment');
    const {
      updateAppointmentStatus,
    } = require('../services/appointmentServices');

    await Appointment.updateOne.mockResolvedValueOnce({
      id: 'abc123',
      status: 'completed',
    });
    const updatedAppointment = await updateAppointmentStatus({
      id: 'abc123',
      status: 'completed',
    });

    expect(updatedAppointment).toEqual({
      id: 'abc123',
      status: 'completed',
    });
  });
});
