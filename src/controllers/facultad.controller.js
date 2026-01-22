const Facultad = require('../models/Facultad');

module.exports.getFactulades = async (req, res) => {
  try {
    const facultadesData = await Facultad.find();

    res.status(200).json(facultadesData);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: 'Error retrieving Facultades' });
  }
};

module.exports.addFacultad = async (req, res) => {
  try {
    const newFacultad = new Facultad(req.body);
    await newFacultad.save();

    res.status(201).json({ message: 'Facultad created successfully' });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }

    console.log(error.message);
    res.status(500).json({ error: 'Failed to create Facultad' });
  }
};

module.exports.updateFacultad = async (req, res) => {
  try {
    const updatedFacultad = await Facultad.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          name: req.body.name,
          description: req.body.description,
          offices: req.body.offices,
        },
      },
      { runValidators: true },
    );

    if (!updatedFacultad) {
      return res.status(404).json({ error: 'Facultad not found' });
    }

    res.status(200).json({ message: 'Facultad updated successfully' });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }

    console.log(error.message);
    res.status(500).json({ error: 'Failed to update Facultad' });
  }
};

module.exports.deleteFacultad = async (req, res) => {
  try {
    const deletedFacultad = await Facultad.findOneAndDelete({ _id: req.params.id });

    if (!deletedFacultad) {
      return res.status(404).json({ error: 'Facultad not found' });
    }

    return res.status(200).json({ message: 'Facultad deleted successfully' });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: 'Failed to delete Facultad' });
  }
};