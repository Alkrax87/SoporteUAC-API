const mongoose = require('mongoose');

const FacultadSchema = mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    offices: [{ type: String, required: true }],
  },
  {
    collection: 'facultades',
    versionKey: false,
  }
);

module.exports = mongoose.model('Facultad', FacultadSchema);