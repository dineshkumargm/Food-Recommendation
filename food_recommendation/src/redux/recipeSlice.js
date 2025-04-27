import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch recipes
export const fetchRecipes = createAsyncThunk(
  'recipes/fetchRecipes',
  async (userId, thunkAPI) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/dashboard/${userId}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const recipeSlice = createSlice({
  name: 'recipes',
  initialState: {
    user: null,
    recipes: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecipes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecipes.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.recipes = action.payload.recipes;
      })
      .addCase(fetchRecipes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch recipes';
      });
  },
});

export default recipeSlice.reducer;
