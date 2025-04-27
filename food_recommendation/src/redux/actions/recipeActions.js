import axios from 'axios';

export const fetchRecipes = () => async (dispatch) => {
  try {
    const response = await axios.get('/api/recipes');
    dispatch({
      type: 'FETCH_RECIPES_SUCCESS',
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: 'FETCH_RECIPES_ERROR',
      payload: error.message,
    });
  }
};
