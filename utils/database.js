const dateServices = require('./date');
const emailServices = require('./email');

const formatData = (date, start, end) => {
  return {
    date: dateServices.easternDate(date),
    start: dateServices.easternDateTime(date, start),
    end: dateServices.easternDateTime(date, end),
    emailId: emailServices.generateEmailId(),
  };
};

module.exports = { formatData };
