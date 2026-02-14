const Pendiente = require("../models/Pendiente")

module.exports.getPendientes = async (req, res) => {
  try {
    const pendientesData = await Pendiente.find().sort({ date: -1 });

    res.status(200).json(pendientesData);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: 'Error retrieving Pendientes' });
  }
}

module.exports.addPendiente = async (req, res) => {
  try {
    const newPendiente = new Pendiente(req.body);
    await newPendiente.save();

    res.status(201).json({ message: 'Pendiente created successfully' });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }

    console.log(error.message);
    res.status(500).json({ error: 'Failed to create Pendiente' });
  }
}

module.exports.updatePendiente = async (req, res) => {
  try {
    const updatedPendiente = await Pendiente.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          report: req.body.report,
          description: req.body.description,
          type: req.body.type,
          school: req.body.facultad,
          office: req.body.office,
          date: req.body.date,
        }
      }
    );

    if (!updatedPendiente) {
      return res.status(404).json({ error: 'Pendiente not found' });
    }

    res.status(200).json({ message: 'Pendiente updated successfully' });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }

    console.log(error.message);
    res.status(500).json({ error: 'Failed to update Pendiente' });
  }
}

module.exports.deletePendiente = async (req, res) => {
  try {
    const deletedPendiente = await Pendiente.findOneAndDelete({ _id: req.params.id });

    if (!deletedPendiente) {
      return res.status(404).json({ error: 'Pendiente not found' });
    }

    return res.status(200).json({ message: 'Pendiente deleted successfully' });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: 'Failed to delete Pendiente' });
  }
}