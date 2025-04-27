// models/inventoryModel.js
const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  expirationDate: {
    type: Date,
    required: true,
  },
  barcode: {
    type: String, // For barcode scanning
    unique: true,
    sparse: true,
  },
  category: {
    type: String, // e.g. "Dairy", "Grains"
    required: false,
  },
  addedOn: {
    type: Date,
    default: Date.now,
  },
});

const Inventory = mongoose.model('Inventory', inventorySchema);

module.exports = Inventory;
