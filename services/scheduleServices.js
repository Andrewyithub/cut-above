const Schedule = require('../models/Schedule');
const {
  findByDate,
  findByApptId,
  addAppointment,
  removeAppointment,
  updateAppointment,
} = require('../repositories/scheduleRepository');
const { checkAvailability } = require('../utils/date');
const AppError = require('../utils/AppError');

// ! Two scenarios: FIND INDEX METHOD
// add modified appointment to schedule
// const prevSchedule = await Schedule.findOne({
//   appointments: req.params.id,
// });
// const scheduledAppointments = [...prevSchedule.appointments];
// const updatedAppointmentIndex = scheduledAppointments.findIndex(
//   (appointmentId) => appointmentId.toString() === req.params.id
// );

// ! Date has changed
// ! 1: Add to new
// newSchedule which is found by formattedData.date
// newSchedule.appointments.push(modifiedAppointment)
// newSchedule.save()
// ! 2: Remove from old schedule
// findIndex method
// prevSchedule which is found by apptData.id (APPT ID)
// prevSchedule.appointments.splice(index, 1)

// ! Date has not changed
// Update old schedule's information:
// findIndex method
// prevSchedule which is found by apptData.id (APPT ID)
// prevSchedule.appointments.splice(index, 1, modifiedAppointment) difference here

const modifyScheduledAppts = async (formattedData, modifiedAppointment) => {
  // Find prev schedule and index of modifying appointment's id
  const prevSchedule = await findByApptId(formattedData.id);
  if (
    // formattedData.date &&
    new Date(formattedData.date).getTime() !==
    new Date(prevSchedule.date).getTime()
  ) {
    const newSchedule = await findByDate(formattedData.date);
    // repo method to push appointment
    await removeAppointment(formattedData.id, prevSchedule);
    return await addAppointment(newSchedule, modifiedAppointment);
  } else {
    return await updateAppointment(
      formattedData.id,
      prevSchedule.id,
      modifiedAppointment
    );
  }
};

module.exports = {
  modifyScheduledAppts,
};
