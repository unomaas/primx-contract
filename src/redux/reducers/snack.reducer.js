const snackReducer = (state ={open: false, message: '', severity: "success"}, action) => {
    switch (action.type) {
      case 'SET_SUCCESSSNACK':
        return {open: true, message: 'A Licensee has been added!', severity: "success"};
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