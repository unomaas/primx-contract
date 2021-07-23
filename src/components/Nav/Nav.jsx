//#region ⬇⬇ Document setup below: 
// ⬇ File setup: 
import './Nav.css';
import NavDrawer from '../NavDrawer/NavDrawer';
// ⬇ Dependent functionality:
import React from 'react';
import { Link } from 'react-router-dom';
import LogOutButton from '../LogOutButton/LogOutButton';
import { useSelector } from 'react-redux';
import MenuIcon from '@material-ui/icons/Menu';
import { SwipeableDrawer, Button, List, ListItem, ListItemText, Divider, IconButton, Box, Grid } from '@material-ui/core';

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
          src="./images/PrimXLogo2.jpg"
          alt="PrimX Company Logo"
        />
      </Box>

      <div className='PackMeUpImage-wrapper'>
        {/* ⬇ Conditioning rendering to switch logos depending on login:
        {user.id ? (
          // ⬇If the user is logged in, show full logo:
          <Link to='/dashboard'>
            <img
              className='PackMeUpImage'
              src="./images/PMUWhiteReg-01.svg"
              alt="Pack Me Up Logo"
            />
          </Link>
        ) : (
          // ⬇ If not logged in, show the icon logo: 
          <Link to='/home'>
            <img
              className='PackMeUpImage'
              src="./images/PMUWhiteIcon.svg"
              alt="Pack Me Up Logo"
            />
          </Link>
        )} */}

        PrīmX
      </div>

      {/* <div>
        <Link className="navLink" to={loginLinkData.path}>
          {loginLinkData.text}
        </Link>

        {user.id && (
          <>
            <Link className="navLink" to="/info">
              Info Page
            </Link>
            <LogOutButton className="navLink" />
          </>
        )}

        <Link className="navLink" to="/about">
          About
        </Link>
      </div> */}

      <div className='NavDrawer-wrapper'>
        <NavDrawer className="NavDrawer-icon" />
      </div>

    </div>
  );
}

export default Nav;
