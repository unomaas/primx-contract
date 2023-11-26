import { combineReducers } from 'redux';

const activeRegions = (state = [], action) => {
  switch (action.type) {
    case 'SET_ACTIVE_REGIONS':
      return action.payload;
    default:
      return state;
  }
};


export default combineReducers({
  activeRegions,
});
