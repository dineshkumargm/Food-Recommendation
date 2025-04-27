import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const SPOONACULAR_API_KEY = 'b08b83a6dae5462088888e6e668b54f6';

const RecipesPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [spoonacularLoading, setSpoonacularLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const [hasMoreRecipes, setHasMoreRecipes] = useState(true);
  const [likes, setLikes] = useState({}); // { recipeId: [userId1, userId2, ...] }

  const userId = useSelector((state) => state.auth.user?.id);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/recipes');
        setRecipes(response.data);
        setFilteredRecipes(response.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch recipes.');
      } finally {
        setLoading(false);
      }
    };

    const fetchLikes = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/recipes/likes');
        setLikes(response.data); // response.data should be { recipeId: [userIds] }
      } catch (err) {
        console.error('Failed to fetch likes:', err);
      }
    };

    fetchRecipes();
    fetchLikes();
  }, []);

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = recipes.filter((recipe) => {
      const titleMatch = recipe.title && recipe.title.toLowerCase().includes(query);
      const descriptionMatch = recipe.description && recipe.description.toLowerCase().includes(query);
      const ingredientsMatch = recipe.ingredients && recipe.ingredients.some((ingredient) =>
        ingredient.toLowerCase().includes(query)
      );
      return titleMatch || descriptionMatch || ingredientsMatch;
    });

    setFilteredRecipes(filtered);
  };

  const handleSelectRecipe = (recipe) => setSelectedRecipe(recipe);
  const handleCloseDetail = () => setSelectedRecipe(null);

  const handleLike = async (id) => {
    if (!userId) {
      alert('Please log in to like recipes');
      return;
    }

    if (likes[id]?.includes(userId)) {
      alert("You can't like this recipe more than once.");
      return;
    }
    console.log(userId);
    try {
      await axios.post(`http://localhost:5000/api/recipes/${id}/like`, { userId });
      setLikes((prev) => ({
        ...prev,
        [id]: [...(prev[id] || []), userId],
      }));
    } catch (err) {
      console.error('Error liking the recipe:', err);
    }
  };

  const handleDislike = async (id) => {
    if (!userId) {
      alert('Please log in to dislike recipes');
      return;
    }

    if (!likes[id]?.includes(userId)) {
      alert("You haven't liked this recipe yet.");
      return;
    }

    try {
      await axios.post(`http://localhost:5000/api/recipes/${id}/dislike`, { userId });
      setLikes((prev) => ({
        ...prev,
        [id]: prev[id].filter((uid) => uid !== userId),
      }));
    } catch (err) {
      console.error('Error disliking the recipe:', err);
    }
  };

  const searchSpoonacular = async (isLoadMore = false) => {
    if (!searchQuery.trim()) return;
    setSpoonacularLoading(true);

    try {
      const response = await axios.get(`https://api.spoonacular.com/recipes/complexSearch`, {
        params: {
          query: searchQuery,
          number: 5,
          offset: pageNumber * 5,
          addRecipeInformation: true,
          instructionsRequired: true,
          apiKey: SPOONACULAR_API_KEY,
        },
      });

      const fetchedRecipes = response.data.results.map((recipe) => ({
        _id: recipe.id,
        title: recipe.title || 'No title',
        description: recipe.summary ? recipe.summary.replace(/<[^>]+>/g, '') : 'No description available.',
        ingredients: recipe.extendedIngredients ? recipe.extendedIngredients.map((ing) => ing.original) : [],
        steps: recipe.analyzedInstructions?.[0]?.steps?.map((step) => step.step) || ['No instructions available.'],
        username: 'Spoonacular',
      }));

      if (isLoadMore) {
        setFilteredRecipes((prev) => [...prev, ...fetchedRecipes]);
      } else {
        setFilteredRecipes(fetchedRecipes);
      }

      setHasMoreRecipes(fetchedRecipes.length === 5);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch recipes from Spoonacular.');
    } finally {
      setSpoonacularLoading(false);
    }
  };

  if (loading) return <p className="text-white text-center mt-20">Loading recipes...</p>;
  if (error) return <p className="text-red-500 text-center mt-20">{error}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-slate-900 text-white px-4 py-10">
      <h2 className="text-4xl font-bold text-center text-cyan-400 mb-10 drop-shadow-neon">🍽️ All Recipes</h2>

      {/* Search Bar */}
      <div className="mb-8 max-w-2xl mx-auto flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          className="flex-1 p-3 text-lg bg-black/30 border border-cyan-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
          placeholder="Search for recipes..."
          value={searchQuery}
          onChange={handleSearch}
        />
        <button
          onClick={() => {
            setPageNumber(0);
            searchSpoonacular(false);
          }}
          className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-semibold transition-all sm:mt-0 mt-4"
        >
          {spoonacularLoading ? 'Searching...' : 'Search Online'}
        </button>
      </div>

      {/* Recipe Cards */}
      <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredRecipes.map((recipe) => (
          <motion.div
            key={recipe._id}
            className="bg-black/40 p-6 rounded-2xl border border-cyan-400 shadow-[0_0_20px_rgba(0,255,255,0.2)] hover:shadow-[0_0_30px_rgba(0,255,255,0.5)] transition-all duration-300 cursor-pointer relative"
            whileHover={{ scale: 1.03 }}
            onClick={() => handleSelectRecipe(recipe)}
          >
            <p className="text-sm text-gray-400 mb-2">
              Posted by <span className="text-cyan-300 font-semibold">{recipe.username || "Unknown"}</span>
            </p>
            <h3 className="text-2xl font-bold text-cyan-300 mb-2">{recipe.title}</h3>
            <p className="text-gray-300 text-sm mb-4">{recipe.description?.slice(0, 100)}...</p>

            {/* Like/Dislike Buttons */}
            <div className="flex gap-4 mt-4" onClick={(e) => e.stopPropagation()}>
              <button
                className="text-green-400 hover:text-green-500 transition"
                onClick={() => handleLike(recipe._id)}
              >
                ❤️ {likes[recipe._id]?.length || 0}
              </button>
              <button
                className="text-red-400 hover:text-red-500 transition"
                onClick={() => handleDislike(recipe._id)}
              >
                💔
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Show More Button */}
      {filteredRecipes.length > 0 && hasMoreRecipes && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => {
              setPageNumber((prev) => prev + 1);
              searchSpoonacular(true);
            }}
            className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-semibold"
          >
            {spoonacularLoading ? 'Loading more...' : 'Show More Recipes'}
          </button>
        </div>
      )}

      {/* Recipe Detail Modal */}
      <AnimatePresence>
        {selectedRecipe && (
          <motion.div
            className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-black/80 w-full sm:w-11/12 md:w-10/12 lg:w-8/12 xl:w-1/2 max-w-lg p-8 rounded-2xl text-center relative"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <button
                onClick={handleCloseDetail}
                className="absolute top-4 right-4 text-cyan-400 hover:text-cyan-500"
              >
                ✖
              </button>
              <h3 className="text-3xl font-bold text-cyan-300 mb-4">{selectedRecipe.title}</h3>
              <p className="text-lg text-gray-400 mb-4">{selectedRecipe.description}</p>
              <p className="text-md text-gray-300">Ingredients:</p>
              <ul className="list-disc list-inside text-gray-400 mb-4">
                {selectedRecipe.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
              <p className="text-md text-gray-300">Steps:</p>
              <ul className="list-decimal list-inside text-gray-400">
                {selectedRecipe.steps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RecipesPage;
