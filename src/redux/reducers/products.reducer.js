import { combineReducers } from 'redux';

// Products array is the full array of product data as it comes back from the database. It's used in the AdminUpdateMaterials component
const productsArray = (state =[], action) => {
    switch (action.type) {
      case 'SET_PRODUCTS_ARRAY':
        return action.payload;
      default:
        return state;
    }
  };

const productsObject = (state = {}, action) => {
  switch (action.type) {
    case 'SET_PRODUCTS_OBJECT':
      return action.payload;
    default:
      return state;
  }
};
  
  // user will be on the redux state at:
  // state.user
  export default combineReducers({
    productsArray,
    productsObject
  });
  