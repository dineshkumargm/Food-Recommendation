const initialState = {
    recipes: [],
    loading: true,
    error: null,
  };
  
  const recipeReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'FETCH_RECIPES_SUCCESS':
        return { ...state, recipes: action.payload, loading: false };
      case 'FETCH_RECIPES_ERROR':
        return { ...state, error: action.payload, loading: false };
      default:
        return state;
    }
  };
  
  export default recipeReducer;
  