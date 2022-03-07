import { combineReducers } from 'redux';

// Products array is the full array of product data as it comes back from the database. It's used in the AdminUpdateMaterials component
const pageData = (state = {}, action) => {
	switch (action.type) {
		case 'SET_DATA_LICENSEE_PORTAL':
			return action.payload;
		default:
			return state;
	} // End switch 
}; // End pageData

const tableData = (state = 'Open Orders', action) => {
	switch (action.type) {
		case 'SET_TABLE_LICENSEE_PORTAL':
			return action.payload;
		default:
			return state;
	} // End switch 
}; // End pageData

// user will be on the redux state at:
// state.user
export default combineReducers({
	pageData,
	tableData,
});
