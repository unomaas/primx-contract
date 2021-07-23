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
import SearchIcon from '@material-ui/icons/Search';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import PersonAddOutlinedIcon from '@material-ui/icons/PersonAddOutlined';
import UpdateIcon from '@material-ui/icons/Update';
import ViewCarouselIcon from '@material-ui/icons/ViewCarousel';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
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
          color="black"
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
            <img src="./images/PrimXLogo-Spaced-Black-01.svg" height="75"></img>
          </Box>

          <Divider />

          {/* Conditioning rendering for what menu options are: */}
          {user.id ? (
            // If user is logged in:
            <List>

              <ListItem button onClick={() => history.push(`/home`)}>
                <AddCircleOutlineOutlinedIcon /> &nbsp;
                <ListItemText primary={"Create New Estimate"} />
              </ListItem>

              <ListItem button onClick={() => history.push(`/lookup`)}>
                <SearchIcon /> &nbsp;
                <ListItemText primary={"Look Up Estimate"} />
              </ListItem>

              <Divider />

              <ListItem button onClick={() => history.push(`/user`)}>
                <HomeOutlinedIcon /> &nbsp;
                <ListItemText primary={"Admin Dashboard"} />
              </ListItem>

              <ListItem button onClick={() => history.push(`/createkit`)}>
                <PersonAddOutlinedIcon /> &nbsp;
                <ListItemText primary={"Create New Admin"} />
              </ListItem>

              <ListItem button onClick={() => history.push(`/createevent`)}>
                <UpdateIcon /> &nbsp;
                <ListItemText primary={"Update Items"} />
              </ListItem>

              <ListItem button onClick={() => history.push(`/packingfor`)}>
                <ViewCarouselIcon /> &nbsp;
                <ListItemText primary={"View Pipeline"} />
              </ListItem>

              {/* Conditional rendering to show system admin portal: */}
              {user.id == '1' ? (
                // If user is system admin (id is 1):
                <>
                  <Divider />

                  <ListItem button onClick={() => dispatch({ type: 'LOGOUT' })}>
                    <SupervisorAccountIcon /> &nbsp;
                    <ListItemText primary={"System Admin View"} />
                  </ListItem>
                </>
              ) : (
                // If user is NOT system admin (id is anything else):
                <>
                </>
              )}
              {/* End System Admin conditional rendering. */}

              <Divider />

              <ListItem button onClick={() => dispatch({ type: 'LOGOUT' })}>
                <ExitToAppIcon /> &nbsp;
                <ListItemText primary={"Log Out"} />
              </ListItem>

            </List>
          ) : (
            // If user is not logged in:
            <List>

              <ListItem button onClick={() => history.push(`/home`)}>
                <AddCircleOutlineOutlinedIcon /> &nbsp;
                <ListItemText primary={"Create New Estimate"} />
              </ListItem>

              <ListItem button onClick={() => history.push(`/lookup`)}>
                <SearchIcon /> &nbsp;
                <ListItemText primary={"Look Up Estimate"} />
              </ListItem>

              <Divider />

              <ListItem button onClick={() => history.push(`/login`)}>
                <ExitToAppIcon /> &nbsp;
                <ListItemText primary={"Admin Login"} />
              </ListItem>

            </List>
          )}
          {/* End conditional rendering for menu options. */}

        </div>
      </Drawer>

    </div>
  )
}
