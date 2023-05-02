import { combineReducers } from 'redux';

// Products array is the full array of product data as it comes back from the database. It's used in the AdminUpdateMaterials component
const pageData = (state = {}, action) => {
	switch (action.type) {
		case 'SET_LICENSEE_PORTAL_DATA':
			return action.payload;
		default:
			return state;
	} // End switch 
}; // End pageData

const tableData = (state = 'Saved Estimates', action) => {
	switch (action.type) {
		case 'SET_LICENSEE_PORTAL_TABLE':
			return action.payload;
		default:
			return state;
	} // End switch 
}; // End pageData

const openOrders = (state = [], action) => {
	switch (action.type) {
		case 'SET_LICENSEE_PORTAL_OPEN_ORDERS':
			return action.payload;
		default:
			return state;
	} // End switch 
}; // End 

const pendingOrders = (state = [], action) => {
	switch (action.type) {
		case 'SET_LICENSEE_PORTAL_PENDING_ORDERS':
			return action.payload;
		default:
			return state;
	} // End switch 
}; // End 

const processedOrders = (state = [], action) => {
	switch (action.type) {
		case 'SET_LICENSEE_PORTAL_PROCESSED_ORDERS':
			return action.payload;
		default:
			return state;
	} // End switch 
}; // End 

const archivedOrders = (state = [], action) => {
	switch (action.type) {
		case 'SET_LICENSEE_PORTAL_ARCHIVED_ORDERS':
			return action.payload;
		default:
			return state;
	} // End switch 
}; // End 

// user will be on the redux state at:
// state.user
export default combineReducers({
	pageData,
	tableData,
	openOrders,
	pendingOrders,
	processedOrders,
	archivedOrders,
});
