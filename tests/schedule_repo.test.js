const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const Appointment = require('../models/Appointment');
const Schedule = require('../models/Schedule');
const {
  create,
  findByDate,
  findById,
  addAppointment,
  removeAppointment,
  updateAppointment,
} = require('../repositories/scheduleRepository');
const { createAppointment } = require('../seeds/appointment');
const { isAvailableAppointment } = require('../services/appointmentServices');
const { createClient, createEmployee } = require('../seeds/users');
const User = require('../models/User');
const AppError = require('../utils/AppError');

// Front end request body is a dayjs object: dayjs(value), for each of these items
const sampleSchedules = [
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

beforeEach(async () => {
  await User.deleteMany();
  await Appointment.deleteMany();
  await Schedule.deleteMany();
});

test('create multiple schedules with schedule create', async () => {
  const newSchedules = await create(sampleSchedules);
  expect(newSchedules).toHaveLength(sampleSchedules.length);
});

test('finding an appointment by id', async () => {
  const newSchedules = await create(sampleSchedules);
  const foundScheduleByDate = await findByDate(sampleSchedules[0].date);
  const foundScheduleById = await findById(foundScheduleByDate.id);
  expect(foundScheduleByDate.id).toBe(foundScheduleById.id);
});

test('create a schedule and find it by id', async () => {
  const newSchedule = await Schedule.create(sampleSchedules[0]);
  const foundSchedule = await findById(newSchedule.id);
  expect(newSchedule.id).toStrictEqual(foundSchedule.id);
});

test('adding appointment to schedule', async () => {
  const client = await createClient();
  const employee = await createEmployee();
  const newSchedule = await Schedule.create(sampleSchedules[3]);
  const newAppt = await createAppointment(client.id, employee.id);
  const modifiedSchedule = await addAppointment(newSchedule, newAppt);
  const modifiedScheduleNative = await Schedule.findById(newSchedule.id);
  expect(modifiedScheduleNative.appointments).toHaveLength(1);
  expect(modifiedSchedule.appointments).toHaveLength(1);
});

test('removing appointment from schedule', async () => {
  const client = await createClient();
  const employee = await createEmployee();
  const newSchedule = await Schedule.create(sampleSchedules[3]);
  const newAppt = await createAppointment(client.id, employee.id);
  const modifiedSchedule = await addAppointment(newSchedule, newAppt);
  const updatedSchedule = await removeAppointment(newAppt.id, newSchedule);
  expect(updatedSchedule.appointments).toHaveLength(0);
});

test('updating an appointment', async () => {
  const client = await createClient();
  const employee = await createEmployee();
  const schedule = await Schedule.create(sampleSchedules[3]);
  const newAppt = await createAppointment(client.id, employee.id);
  newAppt.service = 'The Full Package';
  await newAppt.save();
  expect(newAppt.service).toBe('The Full Package');
  const updatedSchedule = await updateAppointment(
    newAppt.id,
    schedule,
    newAppt
  );
  expect(updatedSchedule.appointments[0].service).toBe('The Full Package');
});

test('checking availability', async () => {
  const client = await createClient();
  const employee = await createEmployee();
  const newSchedule = await Schedule.create(sampleSchedules[3]);
  const newAppt = await createAppointment(client.id, employee.id);
  await addAppointment(newSchedule, newAppt);

  // same identical appointment
  const newAppt2 = await createAppointment(client.id, employee.id);
  try {
    await isAvailableAppointment(newAppt2);
    // If the function does not throw an error, fail the test
    fail('Expected isAvailableAppointment to throw AppError, but it did not.');
  } catch (error) {
    expect(error).toBeInstanceOf(AppError);
    expect(error.statusCode).toBe(500);
    expect(error.message).toBe('Time slot no longer available');
  }
});

afterAll(async () => {
  await mongoose.connection.close();
});
