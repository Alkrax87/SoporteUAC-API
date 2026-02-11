const moment = require('moment-timezone');
const Reporte = require('../models/Reporte');
const Facultad = require('../models/Facultad');

const calculateDifference = (current, previous) => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Number((((current - previous) / previous) * 100).toFixed(2));
};

const getCountByRange = async (startDate, endDate) => {
  return await Reporte.countDocuments({ date: { $gte: startDate, $lte: endDate }});
};

const getCountByRangeAndFacultad = async (startDate, endDate, facultadId) => {
  return Reporte.countDocuments({ school: facultadId, date: { $gte: startDate, $lte: endDate }});
};

const getCountByFacultad = async (start, end) => {
  const facultadesData = await Facultad.find();

  if (facultadesData.length === 0) {
    throw new Error('Facultades not found');
  }

  const result = [];

  for (const facultad of facultadesData) {
    const count = await getCountByRangeAndFacultad(start, end, facultad._id);

    result.push({
      facultad: facultad.name,
      total: count
    });
  }

  return result;
};

const getWeekdayCounts = async () => {
  const startWeek = moment().tz("America/Lima").startOf('isoWeek');

  const result = [];
  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

  for (let i = 0; i < 5; i++) { // lunes a viernes
    const dayStart = startWeek.clone().add(i, 'days').startOf('day').toDate();
    const dayEnd   = startWeek.clone().add(i, 'days').endOf('day').toDate();

    const count = await getCountByRange(dayStart, dayEnd);

    result.push({
      day: days[i],
      reported: count
    });
  }

  return result;
};


module.exports.getDashboard = async (req, res) => {
  const startToday = moment().tz("America/Lima").startOf('day').toDate();
  const endToday = moment().tz("America/Lima").endOf('day').toDate();
  const startYesterday = moment().tz("America/Lima").subtract(1, 'days').startOf('day').toDate();
  const endYesterday = moment().tz("America/Lima").subtract(1, 'days').endOf('day').toDate();

  const startWeek = moment().tz("America/Lima").startOf('isoWeek').toDate();
  const endWeek = moment().tz("America/Lima").endOf('isoWeek').toDate();
  const startLastWeek = moment().tz("America/Lima").subtract(1, 'weeks').startOf('isoWeek').toDate();
  const endLastWeek = moment().tz("America/Lima").subtract(1, 'weeks').endOf('isoWeek').toDate();

  const startMonth = moment().tz("America/Lima").startOf('month').toDate();
  const endMonth = moment().tz("America/Lima").endOf('month').toDate();
  const startLastMonth = moment().tz("America/Lima").subtract(1, 'months').startOf('month').toDate();
  const endLastMonth = moment().tz("America/Lima").subtract(1, 'months').endOf('month').toDate();

  const startYear = moment().tz("America/Lima").startOf('year').toDate();
  const endYear = moment().tz("America/Lima").endOf('year').toDate();
  const startLastYear = moment().tz("America/Lima").subtract(1, 'years').startOf('year').toDate();
  const endLastYear = moment().tz("America/Lima").subtract(1, 'years').endOf('year').toDate();

  const [
    today, yesterday,
    thisWeek, lastWeek,
    thisMonth, lastMonth,
    thisYear, lastYear
  ] = await Promise.all([
      getCountByRange(startToday, endToday),
      getCountByRange(startYesterday, endYesterday),
      getCountByRange(startWeek, endWeek),
      getCountByRange(startLastWeek, endLastWeek),
      getCountByRange(startMonth, endMonth),
      getCountByRange(startLastMonth, endLastMonth),
      getCountByRange(startYear, endYear),
      getCountByRange(startLastYear, endLastYear)
  ]);

  const summary = [
    { label: 'Hoy', value: today, difference: calculateDifference(today, yesterday) },
    { label: 'Esta semana', value: thisWeek, difference: calculateDifference(thisWeek, lastWeek) },
    { label: 'Este mes', value: thisMonth, difference: calculateDifference(thisMonth, lastMonth) },
    { label: 'Este año', value: thisYear, difference: calculateDifference(thisYear, lastYear) }
  ];

  const reportsByFacultad = await getCountByFacultad(startWeek, endWeek);
  const reportsByWeekday = await getWeekdayCounts();

  res.json({summary, reportsByFacultad, reportsByWeekday});
}