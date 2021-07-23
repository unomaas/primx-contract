//#region ⬇⬇ Document setup below: 
// ⬇ File setup: 
import './NavDrawer.css';
import LogOutButton from '../LogOutButton/LogOutButton';
// ⬇ Dependent functionality:
import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useParams, Link } from 'react-router-dom';
import { SwipeableDrawer, Drawer, Button, List, ListItem, ListItemText, Divider, IconButton, Box } from '@material-ui/core';
import { useStyles } from '../MuiStyling/MuiStyling';
// ⬇ Icons:
import MenuIcon from '@material-ui/icons/Menu';
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import AddBoxOutlinedIcon from '@material-ui/icons/AddBoxOutlined';
import WorkOutlineOutlinedIcon from '@material-ui/icons/WorkOutlineOutlined';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import PersonOutlineOutlinedIcon from '@material-ui/icons/PersonOutlineOutlined';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
//#endregion ⬆⬆ Document setup above. 


export default function NavDrawer() {
  //#region ⬇⬇ All state variables below:
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const history = useHistory();
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  //#endregion ⬆⬆ All state variables above. 


  //#region ⬇⬇ Event handlers below:
  //#endregion ⬆⬆ Event handles above. 


  // ⬇ Rendering:
  return (
    <div className="NavDrawer-wrapper">

      <IconButton
      >
        <MenuIcon
          className={classes.navBarIcon}
          onClick={() => setOpen(true)}

        />
      </IconButton>

      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        // onOpen={() => { }}
      >
        <div className={'NavDrawer-menu'}>
          <Box>
            <img src="./images/PMUBlackIcon.svg" height="75"></img>
            <br />
            Pack Me Up!
          </Box>

          <Divider />

          {/* Conditioning rendering for what menu options are: */}
          {user.id ? (
            // If user is logged in:
            <List>
              <ListItem button onClick={() => history.push(`/dashboard`)}>
                <HomeOutlinedIcon /> &nbsp;
                <ListItemText primary={"Dashboard"} />
              </ListItem>

              <ListItem button onClick={() => history.push(`/createkit`)}>
                <AddCircleOutlineOutlinedIcon /> &nbsp;
                <ListItemText primary={"Create Kits"} />
              </ListItem>

              <ListItem button onClick={() => history.push(`/createevent`)}>
                <AddBoxOutlinedIcon /> &nbsp;
                <ListItemText primary={"Create Events"} />
              </ListItem>

              <ListItem button onClick={() => history.push(`/packingfor`)}>
                <WorkOutlineOutlinedIcon /> &nbsp;
                <ListItemText primary={"Start Packing!"} />
              </ListItem>

              <Divider />

              <ListItem button onClick={() => history.push(`/info`)}>
                <InfoOutlinedIcon /> &nbsp;
                <ListItemText primary={"App Info"} />
              </ListItem>

              <ListItem button onClick={() => history.push(`/about`)}>
                <HelpOutlineIcon /> &nbsp;
                <ListItemText primary={"About Us"} />
              </ListItem>

              <Divider />

              <ListItem button onClick={() => history.push(`/user`)}>
                <PersonOutlineOutlinedIcon /> &nbsp;
                <ListItemText primary={"Profile"} />
              </ListItem>

              <ListItem button onClick={() => dispatch({ type: 'LOGOUT' })}>
                <ExitToAppIcon /> &nbsp;
                <ListItemText primary={"Log Out"} />
              </ListItem>

            </List>
          ) : (
            // If user is not logged in:
            <List>

              <ListItem button onClick={() => history.push(`/about`)}>
                <HelpOutlineIcon /> &nbsp;
                <ListItemText primary={"About Us"} />
              </ListItem>

              <Divider />

              <ListItem button onClick={() => history.push(`/registration`)}>
                <PersonOutlineOutlinedIcon /> &nbsp;
                <ListItemText primary={"Register"} />
              </ListItem>

              <ListItem button onClick={() => history.push(`/login`)}>
                <ExitToAppIcon /> &nbsp;
                <ListItemText primary={"Log In"} />
              </ListItem>

            </List>
          )}
          {/* End conditional rendering for menu options. */}

        </div>
      </Drawer>

    </div>
  )
}
