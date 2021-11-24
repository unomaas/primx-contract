const backdropReducer = (state = true, action) => {
  switch (action.type) {
    case 'LOADING_SCREEN_ON':
      return true;
    case 'LOADING_SCREEN_OFF':
      return false;
    default:
      return state;
  }
};

export default backdropReducer;
