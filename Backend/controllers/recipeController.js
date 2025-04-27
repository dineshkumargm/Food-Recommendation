const Recipe = require('../models/Recipe');

// Create a new recipe
exports.createRecipe = async (req, res) => {
  const { title, ingredients, steps, tags } = req.body;
  const userId = req.user.id; // from auth middleware

  try {
    const recipe = new Recipe({
      title,
      ingredients,
      steps,
      tags,
      created_by: userId
    });

    await recipe.save();
    res.status(201).json(recipe);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all recipes or filter
exports.getRecipes = async (req, res) => {
  const { tag, ingredient, user } = req.query;
  let filter = {};

  if (tag) filter.tags = tag;
  if (ingredient) filter.ingredients = { $regex: new RegExp(ingredient, 'i') };
  if (user) filter.created_by = user;

  try {
    const recipes = await Recipe.find(filter).populate('created_by', 'username');
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
