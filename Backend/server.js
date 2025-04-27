const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const User = require('./models/User'); 
const Recipe = require('./models/Recipe'); 
const axios = require('axios');
const socialRoutes = require('./routes/socialRoutes');


dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Hello, World!');
});
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/recipes', require('./routes/recipeRoutes'));
app.use('/api/social', require('./routes/socialRoutes'));
app.use('/api/inventory', require('./routes/inventoryRoutes'));
app.use('/api/ai-features', require('./routes/aiFeaturesRoutes'));
app.use('/api/social', socialRoutes);

// Dashboard route

app.use(express.json());

const SPOONACULAR_API_URL = 'https://api.spoonacular.com/recipes/findByIngredients';
const SPOONACULAR_API_KEY = 'f7533b7b294344fcb9f459efba9984b1' 

app.post('/api/chatbot', async (req, res) => {
  const { mood, ingredients, health } = req.body;

  try {
    const response = await axios.get(SPOONACULAR_API_URL, {
      params: {
        ingredients: Array.isArray(ingredients)
          ? ingredients.join(',')
          : String(ingredients).split(',').map(i => i.trim()).join(','),
        number: 3,
        ranking: 1,
        ignorePantry: true,
        apiKey: SPOONACULAR_API_KEY,
      },
    });

    const recipes = response.data;

    const detailedRecipes = await Promise.all(
      recipes.map(async (recipe) => {
        const detailsResponse = await axios.get(
          `https://api.spoonacular.com/recipes/${recipe.id}/information`,
          {
            params: {
              includeNutrition: false,
              apiKey: SPOONACULAR_API_KEY,
            },
          }
        );

        const details = detailsResponse.data;

        return {
          title: details.title,
          image: details.image,
          ingredients: details.extendedIngredients.map((ing) => ing.original),
          steps: details.analyzedInstructions[0]?.steps.map((s) => s.step) || ['No steps available.'],
        };
      })
    );

    res.json({ mood, health, recipes: detailedRecipes });
  } catch (error) {
    console.error('Error calling Spoonacular API:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to get recipe recommendations' });
  }
});

app.get('/api/dashboard/:userId', async (req, res) => {
  const userId = req.params.userId;
  
  try {
    // Fetch user and their recipes from the database
    const user = await User.findById(userId);
    const recipes = await Recipe.find({ createdBy: userId }); // Assuming "createdBy" is the field in Recipe model
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userData = {
      user: {
        username: user.username,
        following: user.following,
        followers: user.followers,
      },
      recipes: recipes,
    };
    
    console.log(userData);  // Log the fetched user data to see what is being returned
    
    res.json(userData); // Send the data back to the client
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

const PORT = process.env.PORT;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
