const Reporte = require("../models/Reporte");

module.exports.getReportes = async (req, res) => {
  try {
    const reportesData = await Reporte.find().sort({ date: -1 });

    res.status(200).json(reportesData);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: 'Error retrieving Reportes' });
  }
};

module.exports.addReporte = async (req, res) => {
  try {
    const newReporte = new Reporte(req.body);
    await newReporte.save();

    res.status(201).json({ message: 'Reporte created successfully' });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }

    console.log(error.message);
    res.status(500).json({ error: 'Failed to create Reporte' });
  }
}

module.exports.updateReporte = async (req, res) => {
  try {
    const updatedReporte = await Reporte.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          report: req.body.report,
          description: req.body.description,
          type: req.body.type,
          school: req.body.facultad,
          office: req.body.office,
          patrimonialCode: req.body.patrimonialCode,
          date: req.body.date,
        }
      }
    );

    if (!updatedReporte) {
      return res.status(404).json({ error: 'Reporte not found' });
    }

    res.status(200).json({ message: 'Reporte updated successfully' });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }

    console.log(error.message);
    res.status(500).json({ error: 'Failed to update Reporte' });
  }
}

module.exports.deleteReporte = async (req, res) => {
  try {
    const deletedReporte = await Reporte.findOneAndDelete({ _id: req.params.id });

    if (!deletedReporte) {
      return res.status(404).json({ error: 'Reporte not found' });
    }

    return res.status(200).json({ message: 'Reporte deleted successfully' });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: 'Failed to delete Reporte' });
  }
}