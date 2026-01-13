const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 8 },
    name: { type: String, required: true },
    lastname: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: false },
  },
  {
    collection: 'users',
    versionKey: false,
  }
);

UserSchema.pre('save', async function () {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('User', UserSchema);