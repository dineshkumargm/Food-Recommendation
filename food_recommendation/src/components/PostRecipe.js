import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const PostRecipe = () => {
  const userId = useSelector((state) => state.auth.user?.id);
  const username = useSelector((state) => state.auth.user?.username);
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [steps, setSteps] = useState('');
  const [message, setMessage] = useState('');

  const handlePostRecipe = async (e) => {
    e.preventDefault();
    if (!title || !description || !ingredients || !steps) {
      return setMessage('All fields are required.');
    }

    // Split ingredients and steps into arrays
    const ingredientsList = ingredients.split(',').map(item => item.trim()).filter(item => item !== '');
    const stepsList = steps.split(',').map(item => item.trim()).filter(item => item !== '');

    try {
      const res = await axios.post('http://localhost:5000/api/recipes/post', {
        username,
        postedBy: userId,
        title,
        description,
        ingredients: ingredientsList,  // Send as array
        steps: stepsList               // Send as array
      });
      console.log(res.data);
      setMessage('Recipe posted successfully!');
      setTimeout(() => {
        navigate('/home'); // Redirect after success
      }, 1000);
    } catch (err) {
      console.error('Failed to post recipe:', err);
      setMessage('Failed to post recipe.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-slate-900 text-white">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="backdrop-blur-xl bg-white/10 p-8 rounded-3xl shadow-xl w-full max-w-2xl border border-cyan-500"
      >
        <h2 className="text-3xl font-extrabold text-center text-cyan-300 mb-6">
          🍽️ Share Your Recipe
        </h2>

        <form onSubmit={handlePostRecipe} className="space-y-6">
          <input
            type="text"
            placeholder="Recipe Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 bg-black/40 text-white border border-cyan-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder-gray-300"
          />

          <textarea
            placeholder="Short Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 bg-black/40 text-white border border-cyan-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder-gray-300"
            rows="3"
          />

          <textarea
            placeholder="Ingredients (separated by commas)"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            className="w-full px-4 py-2 bg-black/40 text-white border border-cyan-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder-gray-300"
            rows="3"
          />

          <textarea
            placeholder="Steps (separated by commas)"
            value={steps}
            onChange={(e) => setSteps(e.target.value)}
            className="w-full px-4 py-2 bg-black/40 text-white border border-cyan-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder-gray-300"
            rows="5"
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white py-2 rounded-lg font-semibold shadow-lg transition-all hover:shadow-cyan-400/70"
          >
            Post Recipe
          </motion.button>
        </form>

        {message && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-4 text-green-400"
          >
            {message}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
};

export default PostRecipe;
