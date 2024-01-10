const { formatApptData } = require('../services/appointmentServices');
const { create } = require('../repositories/appointmentRepository');

const appointments = [
  {
    date: '2024-01-10',
    start: '17:30',
    end: '18:00',
    service: 'Haircut',
    // employee: 'object_id',
    // user: 'object_id'
  },
  {
    date: '2024-01-11',
    start: '17:30',
    end: '18:00',
    service: 'The Full Package',
    // employee: 'object_id',
    // user: 'object_id'
  },
];
const createAppointment = async (client, employee) => {
  const formattedData = await formatApptData({
    ...appointments[0],
    user: client,
    employee,
  });
  return await create(formattedData);
};
module.exports = { appointments, createAppointment };
