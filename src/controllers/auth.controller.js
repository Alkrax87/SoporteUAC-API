const User = require("../models/User");
const jwt = require('jsonwebtoken');

const JWT_EXPIRES_IN = '1d';
const COOKIE_MAX_AGE = 24 * 60 * 60 * 1000;

createToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET, { expiresIn: JWT_EXPIRES_IN });
}

module.exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.login(username, password);

    res.cookie('jwt', createToken(user._id), { httpOnly: true, maxAge: COOKIE_MAX_AGE, sameSite: 'lax' });
    res.status(200).json({ message: 'Login successful', user: {
      id: user._id,
      name: user.name,
      lastname: user.lastname,
    }});
  } catch (error) {
    res.status(401).json({ error: 'Invalid credentials' });
  }
}

module.exports.logout = (req, res) => {
  res.clearCookie('jwt', '', { httpOnly: true, sameSite: 'lax' });
  res.status(200).json({ message: 'Logout successful' });
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