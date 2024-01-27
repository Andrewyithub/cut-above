const appointmentRepository = require('../repositories/appointmentRepository');
const Appointment = require('../models/Appointment');
jest.mock('../models/Appointment');

test('updating status through repo', async () => {
  await Appointment.updateOne.mockResolvedValueOnce({
    id: 'abc123',
    status: 'completed',
  });

  const updatedAppointment = await appointmentRepository.updateStatus(
    'abc123',
    {
      status: 'completed',
    }
  );
  expect(updatedAppointment).toEqual({
    id: 'abc123',
    status: 'completed',
  });
});
