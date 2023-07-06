const scheduleRouter = require('express').Router();
const Schedule = require('../models/Schedule');
const date = require('../utils/date');

scheduleRouter.get('/', async (req, res) => {
  const schedule = await Schedule.find({});
  res.json(schedule);
});

scheduleRouter.post('/', async (req, res) => {
  // const schedules = req.body;
  const { dates, open, close } = req.body;
  // console.log(date.convertToEST(schedules.end));
  // console.log(date.convertToEST(schedules.start));
  // console.log(date.convertToEST(schedules.open));
  // console.log(date.convertToEST(schedules.close));
  // const newSchedule = new Schedule({
  //   date: date.convertToEST(schedules.start),
  //   open: date.convertToEST(schedules.open),
  //   close: date.convertToEST(schedules.close),
  // });
  const dateRangeToSchedule = date.generateRange(dates, open, close);
  console.log(dateRangeToSchedule);
  // const newSchedule = new Schedule({
  //   date: schedules.start,
  //   open: schedules.open,
  //   close: schedules.close,
  // });
  // await newSchedule.save();
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
