const User = require('../models/User');

module.exports.getUsers = async (req, res) => {
  try {
    const usersData = await User.find();

    res.status(200).json(usersData);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: 'Error retrieving users' });
  }
};

module.exports.addUser = async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }

    console.log(error.message);
    res.status(500).json({ error: 'Failed to create User' });
  }
};

module.exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          username: req.body.username,
          name: req.body.name,
          lastname: req.body.lastname,
          isAdmin: req.body.isAdmin,
        },
      },
      { runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }

    console.log(error.message);
    res.status(500).json({ error: 'Failed to update User' });
  }
};

module.exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findOneAndDelete({ _id: req.params.id });

    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: 'Failed to delete User' });
  }
};