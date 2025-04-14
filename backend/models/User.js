const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); 

// Define the user schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10); // Hash the password with bcrypt
  next();
});

// Method to compare the entered password with the hashed password
userSchema.methods.comparePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

// Create the user model
const User = mongoose.model('User', userSchema);

module.exports = User;
//adwd