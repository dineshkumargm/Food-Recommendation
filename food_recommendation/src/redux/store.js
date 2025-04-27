import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import recipeReducer from './recipeSlice'; // if this exists
import chatReducer from './chatSlice';  // Make sure the path is correct relative to your file structure

const store = configureStore({
  reducer: {
    auth: authReducer,
    recipes: recipeReducer, // include only if you've created this slice
    chat: chatReducer,
  },
});

export default store;
