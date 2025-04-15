const mongoose = require('mongoose');
const bcrypt = require('bcrypt');  

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
  },
});

// Hash password before saving it to the database
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);  // Hash the password
  }
  next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
