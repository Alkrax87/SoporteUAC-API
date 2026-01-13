const User = require("../models/User");

module.exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.login(username, password);

    res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message});
  }
}

module.exports.resetPassword = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.password = req.body.newPassword;
    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: 'Failed to reset password' });
  }
};