const mongoose = require('mongoose');

const PendienteSchema = mongoose.Schema(
  {
    report: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, required: true },
    school: { type: String, required: true },
    office: { type: String, required: true },
    date: { type: Date, required: true },
  },
  {
    collection: 'pendiente',
    versionKey: false,
  }
);

module.exports = mongoose.model('Pendiente', PendienteSchema);