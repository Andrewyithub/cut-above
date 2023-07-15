const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone'); // dependent on utc plugin
const isSameOrAfter = require('dayjs/plugin/isSameOrAfter');
const isSameOrBefore = require('dayjs/plugin/isSameOrBefore');

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

// const convertToEST = (date) => dayjs(date).format('YYYY-MM-DD hh:mm A');

const convertToEST = (date) => {
  const formattedDate = dayjs(date).format('YYYY-MM-DD');
  const dateObj = dayjs.tz(formattedDate, 'America/New_York');
  return dateObj;
};

const convertToEstTime = (dateObj, time) => {
  const [hour, min] = time.split(':');
  return dateObj.hour(Number(hour)).minute(Number(min));
};

const generateRange = (dates, open, close) => {
  const [start, end] = dates;
  const endDate = dayjs(end).format('YYYY-MM-DD');
  const [openHour, openMinute] = open.split(':');
  const [closeHour, closeMinute] = close.split(':');
  const datesToSchedule = [];
  let currentDate = dayjs(start);

  while (currentDate.isSameOrBefore(endDate, 'day')) {
    const currentDay = currentDate.format('YYYY-MM-DD');
    const dateObj = dayjs.tz(currentDay, 'America/New_York');

    datesToSchedule.push({
      date: dateObj,
      open: dateObj.hour(Number(openHour)).minute(Number(openMinute)),
      close: dateObj.hour(Number(closeHour)).minute(Number(closeMinute)),
    });

    currentDate = currentDate.add(1, 'day');
  }

  return datesToSchedule;
};

module.exports = { convertToEST, convertToEstTime, generateRange };
