const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  found: { type: Boolean, default: false },
  location: { type: String },
  date: { type: Date, default: Date.now },
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
