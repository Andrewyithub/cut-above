const scheduleRouter = require('express').Router();
const Schedule = require('../models/Schedule');
const date = require('../utils/date');

scheduleRouter.get('/', async (req, res) => {
  const schedule = await Schedule.find({});
  res.json(schedule);
});

scheduleRouter.post('/', async (req, res) => {
  const { dates, open, close } = req.body;
  const dateRangeToSchedule = date.generateRange(dates, open, close);
  const newSchedules = dateRangeToSchedule
    .map((schedule) => new Schedule(schedule))
    .map((newSchedule) => newSchedule.save());
  await Promise.all(newSchedules);
  res.status(201).json({
    message: 'New schedule added',
    data: newSchedules,
  });
});

module.exports = scheduleRouter;
