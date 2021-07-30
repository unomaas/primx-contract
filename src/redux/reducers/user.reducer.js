const userReducer = (state = {}, action) => {
  switch (action.type) {
    //requesting info of currently logged in user
    case 'SET_USER':
      return action.payload;
    case 'UNSET_USER':
      return {};
    default:
      return state;
  }
};

// user will be on the redux state at:
// state.user
export default userReducer;
