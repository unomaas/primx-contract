import { combineReducers } from 'redux';

const productsArray = (state =[], action) => {
    switch (action.type) {
      case 'SET_PRODUCTS':
        return action.payload;
      default:
        return state;
    }
  };
  
  // user will be on the redux state at:
  // state.user
  export default combineReducers({
    productsArray
  });
  