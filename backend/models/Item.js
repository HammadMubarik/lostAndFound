const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  photo: {
    type: String, // Path to the image file
  },
});

const Item = mongoose.model('Item', itemSchema);
module.exports = Item;

