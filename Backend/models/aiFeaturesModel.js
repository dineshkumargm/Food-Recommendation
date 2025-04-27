// models/aiFeaturesModel.js
const mongoose = require('mongoose');

const aiFeaturesSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming you already have a User model
    required: true,
  },
  availableIngredients: {
    type: [String], // List of ingredients user has
    required: true,
  },
  tastePreferences: {
    type: [String], // e.g. ["Spicy", "Sweet"]
  },
  mealPlan: {
    type: Array, // Weekly meal plan details
    required: true,
  },
  nutritionalBalance: {
    type: Object, // Key-value pairs for nutrients (e.g. { protein: 50, carbs: 30 })
  },
  substitutionSuggestions: {
    type: Map,
    of: String, // For ingredient substitutions
  },
  recommendations: {
    type: Array, // List of recommended recipes
  },
});

const AIFeatures = mongoose.model('AIFeatures', aiFeaturesSchema);

module.exports = AIFeatures;

