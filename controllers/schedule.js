const scheduleRouter = require('express').Router();
const Schedule = require('../models/Schedule');

scheduleRouter.post('/', async (request, response) => {
  const schedules = request.body;
  const newSchedules = schedules
    .map((schedule) => new Schedule(schedule))
    .map((newSchedule) => newSchedule.save());
  await Promise.all(newSchedules);
  response.status(201).json({
    message: 'New schedule added',
    data: newSchedules,
  });
});

module.exports = scheduleRouter;
