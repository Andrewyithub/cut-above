const { formatData } = require('../utils/database');

test('test database util which formats dates to be saved', async () => {
  const date = '2023-12-24';
  const start = '10:00';
  const end = '10:30';
  const formattedData = formatData(date, start, end);
  // convert dayjs object to iso string
  expect(new Date(formattedData.date).toISOString()).toBe(
    '2023-12-24T05:00:00.000Z'
  );
  expect(new Date(formattedData.end).toISOString()).toBe(
    '2023-12-24T15:30:00.000Z'
  );
  expect(new Date(formattedData.start).toISOString()).toBe(
    '2023-12-24T15:00:00.000Z'
  );
});
