import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to get recipe recommendations
export const getRecipeRecommendations = createAsyncThunk(
  'chat/getRecipeRecommendations',
  async ({ mood, ingredients, health }, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:5000/api/chatbot', {
        mood,
        ingredients,
        health,
      });
      return response.data.recipes;  // Assumes the response contains recipes in this format
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    messages: [
      { sender: 'bot', text: 'How are you feeling today?' },  // Initial bot message
    ],
    recipes: [],
    status: 'idle',  // Track the loading status (idle, loading, succeeded, failed)
    error: null,
    step: 'mood',  // Tracks input stage: mood, ingredients, health, done
  },
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);

      // Check the current step and update the step accordingly
      if (action.payload.sender === 'user') {
        if (state.step === 'mood') {
          state.step = 'ingredients';
          state.messages.push({ sender: 'bot', text: 'What ingredients do you have?' });
        } else if (state.step === 'ingredients') {
          state.step = 'health';
          state.messages.push({ sender: 'bot', text: 'Any dietary restrictions or health considerations?' });
        } else if (state.step === 'health') {
          state.step = 'done';
        }
      }
    },
    resetChat: (state) => {
      state.messages = [{ sender: 'bot', text: 'How are you feeling today?' }];
      state.recipes = [];
      state.step = 'mood';
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getRecipeRecommendations.pending, (state) => {
        state.status = 'loading';  // Mark loading status
      })
      .addCase(getRecipeRecommendations.fulfilled, (state, action) => {
        state.status = 'succeeded';  // Recipes fetched successfully
        state.recipes = action.payload;  // Set the recipes in the state
      })
      .addCase(getRecipeRecommendations.rejected, (state, action) => {
        state.status = 'failed';  // Mark as failed if there's an error
        state.error = action.payload.error;
        state.messages.push({ sender: 'bot', text: 'Sorry, I couldn’t fetch recipes. Try again?' });
      });
  },
});

export const { addMessage, resetChat } = chatSlice.actions;
export default chatSlice.reducer;
