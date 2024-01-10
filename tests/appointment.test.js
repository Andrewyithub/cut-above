const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const { create, modify } = require('../repositories/appointmentRepository');
const { formatApptData } = require('../services/appointmentServices');
const { sampleUsers } = require('../seeds/users');
const User = require('../models/User');
const { appointments } = require('../seeds/appointment');
const { findById } = require('../repositories/userRepository');
const Appointment = require('../models/Appointment');

beforeAll(async () => {
  await User.deleteMany();
  await User.insertMany(sampleUsers);
  await Appointment.deleteMany();
});

describe('modifying an appointment', () => {
  test('clients are added', async () => {
    const clients = await User.find();
    expect(clients).toHaveLength(sampleUsers.length);
  });
  test('finding a client using repo method', async () => {
    const client = await User.findOne({ firstName: sampleUsers[0].firstName });
    const id = client._id.toString();
    const clientFoundByRepo = await findById(id);
    expect(clientFoundByRepo.firstName).toBe('John');
  });

  test('modifying an appointment through repo', async () => {
    const client = await User.findOne({ firstName: sampleUsers[0].firstName });
    const employee = await User.findOne({
      firstName: sampleUsers[1].firstName,
    });
    const formattedData = await formatApptData({
      ...appointments[0],
      user: client,
      employee,
    });
    const newAppointment = await create(formattedData);
    const newEmployee = await User.findOne({
      firstName: sampleUsers[2].firstName,
    });
    const formattedNewData = await formatApptData({
      ...appointments[1],
      user: client,
      employee: newEmployee,
    });
    const modifiedAppointment = await modify({
      ...formattedNewData,
      id: newAppointment._id,
    });
    const modifiedAppointmentToCheck = await Appointment.findById(
      newAppointment._id
    );
    expect(modifiedAppointment.employee._id.toString()).toEqual(
      newEmployee._id.toString()
    );
    expect(modifiedAppointment.service).toBe('The Full Package');
    expect(modifiedAppointmentToCheck.employee._id.toString()).toEqual(
      newEmployee.id.toString()
    );
    expect(modifiedAppointmentToCheck.service).toBe('The Full Package');
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
