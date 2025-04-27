const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  ingredients: [String],
  steps: [String],
  image: { type: String }, // if you support image upload later
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  username: String,
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Recipe', RecipeSchema);
