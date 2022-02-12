const userInfo = (state = [], action) => {
    switch (action.type) {
        //requesting user info data of ALL users
        case 'SET_ADMIN_INFO':
            return action.payload;
        default:
            return state;
    }
};

export default userInfo;