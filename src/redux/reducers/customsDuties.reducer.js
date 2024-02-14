import {
	combineReducers
} from 'redux';

export const customsDutiesArray = (state = [], action) => {
	switch (action.type) {
		// request from adminEstimates saga, payload is an array of estimate objects
		case 'SET_CUSTOMS_DUTIES':
			return action.payload;
		default:
			return state;
	}
}

export const eachCustomsDuties = (state = [], action) => {
	switch (action.type) {
		// request from adminEstimates saga, payload is an array of estimate objects
		case 'SET_EACH_CUSTOMS_DUTIES':
			return action.payload;
		default:
			return state;
	}
}

export const customsDutiesHistoryAllArray = (state = [], action) => {
	switch (action.type) {
		case 'SET_CUSTOMS_DUTIES_HISTORY_ALL':
			return action.payload;
		default:
			return state;
	} // End switch
}; // End 

export const customsDutiesHistoryRecentArray = (state = [], action) => {
	switch (action.type) {
		case 'SET_CUSTOMS_DUTIES_HISTORY_RECENT':
			return action.payload;
		default:
			return state;
	} // End switch
}; // End 

export default combineReducers({
	customsDutiesArray,
	eachCustomsDuties,
	customsDutiesHistoryAllArray,
	customsDutiesHistoryRecentArray,
});