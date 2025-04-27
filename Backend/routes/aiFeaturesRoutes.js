// routes/aiFeaturesRoutes.js
const express = require('express');
const AIFeatures = require('../models/aiFeaturesModel');
const router = express.Router();

// Get AI features by userId
router.get('/:userId', async (req, res) => {
  try {
    const aiFeatures = await AIFeatures.findOne({ userId: req.params.userId });
    res.json(aiFeatures);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update AI features for a user
router.put('/:userId', async (req, res) => {
  try {
    const updatedAIFeatures = await AIFeatures.findOneAndUpdate(
      { userId: req.params.userId },
      req.body,
      { new: true }
    );
    res.json(updatedAIFeatures);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Add a new AI feature record for a user
router.post('/:userId', async (req, res) => {
  const { availableIngredients, tastePreferences, mealPlan, nutritionalBalance } = req.body;

  const newAIFeature = new AIFeatures({
    userId: req.params.userId,
    availableIngredients,
    tastePreferences,
    mealPlan,
    nutritionalBalance,
  });

  try {
    const savedAIFeature = await newAIFeature.save();
    res.status(201).json(savedAIFeature);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
