const Appointment = require('../models/Appointment');

const getAll = async (user) => {
  return await Appointment.find({
    $or: [{ client: user }, { employee: user }],
  });
};

const getOne = async (id) => {
  return await Appointment.findOne({
    emailId: id,
  });
};

const create = async (appointmentData) => {
  return await Appointment.create(appointmentData);
};

const updateStatus = async (id, status) => {
  const updatedAppointment = await Appointment.updateOne(
    { _id: id },
    { $set: { status } }
  );
  return updatedAppointment;
};

const modify = async (newApptData) => {
  return await Appointment.findByIdAndUpdate(newApptData.id, newApptData, {
    new: true,
    runValidators: true,
  });
};

const cancel = async (id) => {
  const { date, employee, start } = await Appointment.findByIdAndDelete(id);
  return { date, employee, start };
};

module.exports = {
  getAll,
  getOne,
  create,
  updateStatus,
  modify,
  cancel,
};
