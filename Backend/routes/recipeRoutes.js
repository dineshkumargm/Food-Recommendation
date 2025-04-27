const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Recipe = require('../models/Recipe');

// GET all recipes
router.get('/', async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🚀 GET recipes by specific user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    // console.log(userId);
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID format.' });
    }

    const recipes = await Recipe.find({ postedBy: new mongoose.Types.ObjectId(userId) }).sort({ createdAt: -1 });

    if (!recipes.length) {
      return res.status(404).json({ message: 'No recipes found for this user.' });
    }

    res.json(recipes);
  } catch (err) {
    console.error('Error fetching user recipes:', err);
    res.status(500).json({ message: 'Server Error: Unable to fetch user recipes.' });
  }
});

// 🚀 Get random recipes (explore page)
router.get('/random', async (req, res) => {
  try {
    const recipes = await Recipe.aggregate([{ $sample: { size: 30 } }]);
    res.status(200).json(recipes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get('/likes', async (req, res) => {
  // console.log('API called')
  try {
    const recipes = await Recipe.find({}, 'id likes');
    // console.log(recipes)
    // Make it { recipeId1: [userId1, userId2], recipeId2: [...] }
    const likesData = {};
    recipes.forEach((recipe) => {
      likesData[recipe._id] = recipe.likes || [];
    });

    res.json(likesData);
  } catch (err) {
    console.error('Error fetching likes:', err);
    res.status(500).json({ message: 'Server Error fetching likes' });
  }
});
// 🚀 GET single recipe by ID (THIS MUST BE LAST!)
router.get('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new recipe
router.post('/post', async (req, res) => {
  try {
    const newRecipe = new Recipe(req.body);
    const savedRecipe = await newRecipe.save();
    res.status(201).json(savedRecipe);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Like or Unlike a recipe
router.post('/:id/like', async (req, res) => { 
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    const userId = req.body.userId;
    if (!userId) return res.status(400).json({ message: 'User ID required' });

    const objectUserId = new mongoose.Types.ObjectId(userId);

    if (!recipe.likes.includes(objectUserId)) {
      recipe.likes.push(objectUserId);
      await recipe.save();
      res.status(200).json('Recipe liked');
    } else {
      recipe.likes.pull(objectUserId);
      await recipe.save();
      res.status(200).json('Recipe unliked');
    }
  } catch (err) {
    console.error('Error liking/unliking:', err);
    res.status(500).json({ message: err.message });
  }
});


router.post('/:id/dislike', async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  try {
    const recipe = await Recipe.findById(id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    recipe.likes = recipe.likes.filter(uid => uid.toString() !== userId);

    await recipe.save();
    res.status(200).json({ message: 'Disliked the recipe' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error disliking recipe' });
  }
});

// DELETE a recipe
router.delete('/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: 'Invalid post ID format.' });
    }

    const deletedRecipe = await Recipe.findByIdAndDelete(postId);

    if (!deletedRecipe) {
      return res.status(404).json({ message: 'Recipe not found.' });
    }

    res.json({ message: 'Recipe deleted successfully.' });
  } catch (err) {
    console.error('Error deleting recipe:', err);
    res.status(500).json({ message: 'Server Error: Unable to delete recipe.' });
  }
});



module.exports = router;
