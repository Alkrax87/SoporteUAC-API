const mongoose = require('mongoose');

const ReporteSchema = mongoose.Schema(
  {
    report: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, required: true },
    school: { type: String, required: true },
    office: { type: String, required: true },
    time: { type: String, required: true },
    patrimonialCode: { type: String },
    date: { type: Date, required: true },
  },
  {
    collection: 'reportes',
    versionKey: false,
  }
);

module.exports = mongoose.model('Reporte', ReporteSchema);