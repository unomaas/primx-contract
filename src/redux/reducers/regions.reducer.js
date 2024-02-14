import { combineReducers } from 'redux';

const defaultRegionsData = {
  allRegions: [], 
  activeRegions: [],
  products: [],
  customsDuties: [],
  containerSizes: [],
  containerStats: {},
}; 

const regionData = (state = defaultRegionsData, action) => {
  switch (action.type) {
    case 'SET_REGIONS_DATA':
      return {
        ...state,
        ...action.payload,
      };
    case 'CLEAR_REGIONS_DATA':
      return defaultRegionsData;
    default:
      return state;
  }
};


export default combineReducers({
  regionData,
});
