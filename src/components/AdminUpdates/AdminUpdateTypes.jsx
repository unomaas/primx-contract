import React from 'react'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'

//components
import AdminUpdates from './AdminUpdates';
import UpdateFloorTypesGrid from './UpdateFloorTypesGrid.jsx';
import UpdatePlacementTypesGrid from './UpdatePlacementTypesGrid'; 

//imports for MUI
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import TextField from '@material-ui/core/TextField';


export default function AdminUpdateTypes() {

  const dispatch = useDispatch();

  //useSelector for array of floor types
  const floorTypes = useSelector(store => store.floorTypes);
  const placementTypes = useSelector(store => store.placementTypes);


   //styles for MUI
   const useStyles = makeStyles((theme) => ({
    root: {
      '& > *': {
        margin: theme.spacing(1),
      },
    },
  }));
  //defining classes for MUI
  const classes = useStyles();

  useEffect(() => {
    // GET floor and placement types data on page load
    dispatch({type: 'FETCH_FLOOR_TYPES'});
    dispatch({type: 'FETCH_PLACEMENT_TYPES'});
  }, [])


  return (
    <div>
      <AdminUpdates />
      <h4>Update Floor Types</h4>

        {/* input nd add button for adding new floor types */}
        <form  className={classes.root} noValidate autoComplete="off">
          <TextField id="outlined-basic" label="Add New Floor Type" variant="outlined" />
          <Fab className={classes.root} color="primary" aria-label="add">
            <AddIcon />
          </Fab>
        </form>

      {/* showing floor types */}
      <UpdateFloorTypesGrid floorTypes={floorTypes}/>

      <h4>Update Floor Types</h4>
        {/* input and add button for adding new placement types */}
        <form  className={classes.root} noValidate autoComplete="off">
          <TextField id="outlined-basic" label="Add New Placement Type" variant="outlined" />
            <Fab className={classes.root} color="primary" aria-label="add">
              <AddIcon />
            </Fab>
        </form>

      {/* showing placement types */}
      <UpdatePlacementTypesGrid placementTypes={placementTypes}/>




      {/* <AdminUpdateTypesGrid floorAndPlacementTypes={placementTypes}/> */}
    </div>
  )
}
