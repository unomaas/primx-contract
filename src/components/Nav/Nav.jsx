//#region ⬇⬇ Document setup below: 
// ⬇ File setup: 
import './Nav.css';
import NavDrawer from '../NavDrawer/NavDrawer';
// ⬇ Dependent functionality:
import React from 'react';
import { useSelector } from 'react-redux';
import { Box } from '@material-ui/core';

//#endregion ⬆⬆ Document setup above. 


function Nav() {
  //#region ⬇⬇ All state variables below:
  const user = useSelector((store) => store.user);
  //#endregion ⬆⬆ All state variables above. 

  let loginLinkData = {
    path: '/login',
    text: 'Login / Register',
  };

  if (user.id != null) {
    loginLinkData.path = '/home';
    loginLinkData.text = 'Home';
  }

  return (
    <div className="Nav-wrapper">

      <Box className='GenocchioImage-wrapper'>
        <img
          className='GenocchioImage'
          src="./images/PrimXLogo-Spaced-White-01.svg"
          alt="PrimX Company Logo"
        />
      </Box>

      <div className='NavDrawer-wrapper'>
        <NavDrawer className="NavDrawer-icon" />
      </div>

    </div>
  );
}

export default Nav;
