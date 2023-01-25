import { combineReducers } from 'redux';
import errors from './errors.reducer';
import user from './user.reducer';
import companies from './companies.reducer';
import adminEstimates from './adminEstimates.reducer';
import floorTypes from './floorTypes.reducer';
import placementTypes from './placementTypes.reducer';
import products from './products.reducer';
import shippingCosts from './shippingCosts.reducer';
import shippingDestinations from './shippingDestinations.reducer';
import estimatesReducer from './estimates.reducer';
import userInfoReducer from './userInfo.reducer';
import snackBar from './snack.reducer';
import combineEstimatesReducer from './combineEstimates.reducer';
import backdropReducer from './backdrop.reducer';
import licenseePortalReducer from './licenseePortal.reducer';
import customsDuties from './customsDuties.reducer';
import productContainers from './productContainers.reducer';

// rootReducer is the primary reducer for our entire project
// It bundles up all of the other reducers so our project can use them.
// This is imported in index.js as rootSaga

// Lets make a bigger object for our store, with the objects from our reducers.
// This is what we get when we use 'state' inside of 'mapStateToProps'
const rootReducer = combineReducers({
  errors, // contains registrationMessage and loginMessage
  user, // will have an id and username if someone is logged in
  companies, // contains companies
  adminEstimates, // will contain an array of estimate objects
  placementTypes, //contains placement types
  floorTypes, //contains floor types
  products, // contains products, prices of products and products available
  shippingCosts, //contains the shipping costs
  estimatesReducer, // contains the create new estimate build
  userInfoReducer, //contains all users for system admin view
  snackBar, // Is the reducer data for snackbar alerts. 
  combineEstimatesReducer, // Is the reducer for combining multiple estimates.
  backdropReducer, // Handles the backdrop and loading screen animation. 
	licenseePortalReducer, // Handles the Licensee Portal data load. 
	shippingDestinations, // Contains the shipping destinations for the Licensee Portal.
	customsDuties, // Contains the customs duties for the admin portal
	productContainers, // Contains the product containers for the admin portal
});

export default rootReducer;
