const snackReducer = (state ={open: false, message: '', severity: "success"}, action) => {
    switch (action.type) {
      case 'SET_SUCCESS_COMPANY':
        return {open: true, message: 'A Licensee Has Been Added!', severity: "success"}
      case 'SET_SUCCESS_SHIPPING':
        return {open: true, message: 'Shipping Details Have Been Added!', severity: "success"}
      case 'SET_SUCCESS_FLOOR_TYPES':
        return {open: true, message: 'Floor Type has Been Added!', severity: "success"}
      case 'SET_SUCCESS_PLACEMENT_TYPES':
        return {open: true, message: 'Placement Type has Been Added!', severity: "success"}
      case 'SET_CLOSE':
        return {...state,open: false}
      case 'SET_EMPTY_ERROR' :
        return {open: true, message: 'Must Fill All Input Fields To Add', severity: "error"}
      default:
        return state;
    }
  };
  
  // user will be on the redux state at:
  // state.user
  export default snackReducer;