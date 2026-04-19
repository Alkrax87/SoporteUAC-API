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

const getCountByRangeAndType = async (startDate, endDate, type) => {
  return Reporte.countDocuments({ type: type, date: { $gte: startDate, $lte: endDate }});
}

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
      value: count
    });
  }

  return result;
};

const getCountsByWeekday = async () => {
  const startWeek = moment().tz("America/Lima").startOf('isoWeek');

  const result = [];
  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

  for (let i = 0; i < 5; i++) { // lunes a viernes
    const dayStart = startWeek.clone().add(i, 'days').startOf('day').toDate();
    const dayEnd   = startWeek.clone().add(i, 'days').endOf('day').toDate();

    const count = await getCountByRange(dayStart, dayEnd);

    result.push({
      key: days[i],
      reported: count
    });
  }

  return result;
};

const getCountsByMonthWeeks = async (startMonth, endMonth) => {
  const result = [];
  let current = moment(startMonth).tz("America/Lima").startOf('week');

  let weekIndex = 1;

  while (current.isBefore(endMonth)) {
    const adjustedStart = moment.max(current, moment(startMonth)).toDate();
    const adjustedEnd = moment.min(current.clone().endOf('week'), moment(endMonth)).toDate();

    const count = await getCountByRange(adjustedStart, adjustedEnd);

    result.push({
      key: `Semana ${weekIndex}`,
      reported: count
    });

    current.add(1, 'week');
    weekIndex++;
  }

  return result;
};

const getCountsByYearMonths = async (startYear, endYear) => {
  const result = [];
  let current = moment(startYear).tz("America/Lima").startOf('month');

  const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  let index = 0;

  while (current.isBefore(endYear)) {
    const monthStart = current.clone().startOf('month').toDate();
    const monthEnd = current.clone().endOf('month').toDate();

    const count = await getCountByRange(monthStart, monthEnd);

    result.push({
      key: months[index],
      reported: count
    });

    current.add(1, 'month');
    index++;
  }

  return result;
};

const getCountByType = async (startDate, endDate) => {
  const types = ['Hardware', 'Software', 'Impresora', 'Red', 'Anexo', 'Accesorios', 'Otros']

  const result = [];

  for (const type of types) {
    const count = await getCountByRangeAndType(startDate, endDate, type);

    result.push({
      quarter: type,
      value: count
    });
  }

  return result;
}

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

  res.json({
    summary,
    reportsByTime: {
      weekDays: await getCountsByWeekday(),
      monthWeeks: await getCountsByMonthWeeks(startMonth, endMonth),
      yearMonths: await getCountsByYearMonths(startYear, endYear),
    },
    reportsByFacultad: {
      weekDays: await getCountByFacultad(startWeek, endWeek),
      monthWeeks: await getCountByFacultad(startMonth, endMonth),
      yearMonths: await getCountByFacultad(startYear, endYear),
    },
    reportsByType: {
      weekDays: await getCountByType(startWeek, endWeek),
      monthWeeks: await getCountByType(startMonth, endMonth),
      yearMonths: await getCountByType(startYear, endYear),
    }
  });
}

module.exports.getDataForExcel = async (req, res) => {
  try {
    const startMonth = moment(req.params.month, 'M').tz("America/Lima").startOf('month').toDate();
    const endMonth = moment(req.params.month, 'M').tz("America/Lima").endOf('month').toDate();

    const facultades = await Facultad.find();
    const total = await getCountByRange(startMonth, endMonth);
    const reportes = await Reporte.find({ date: { $gte: startMonth, $lte: endMonth }});
    const dataByFacultad = await getCountByFacultad(startMonth, endMonth);
    const dataByType = await getCountByType(startMonth, endMonth);
    const dataByWeeks = await getCountsByMonthWeeks(startMonth, endMonth);

    const computedReportes = reportes.map((reporte) => {
      return {
        report: reporte.report,
        description: reporte.description,
        type: reporte.type,
        school: facultades.find((facultad) => facultad._id.toString() === reporte.school.toString()).name,
        office: reporte.office,
        time: reporte.time,
        patrimonialCode: reporte.patrimonialCode,
        date: reporte.date,
      }
    });

    res.status(200).json({
      total,
      reportes: computedReportes,
      dataByType,
      dataByFacultad,
      dataByWeeks
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}