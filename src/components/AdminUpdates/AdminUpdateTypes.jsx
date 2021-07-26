import React from 'react'

import AdminUpdates from './AdminUpdates';

//imports for MUI
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import TextField from '@material-ui/core/TextField';


export default function AdminUpdateTypes() {

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


  return (
    <div>
      <AdminUpdates />
      <h4>Update Floor Types</h4>

      <div>
        <form  className={classes.root} noValidate autoComplete="off">
          <TextField id="outlined-basic" label="Add New Floor Type" variant="outlined" />
          <Fab className={classes.root} color="primary" aria-label="add">
            <AddIcon />
          </Fab>
        </form>
      </div>

      <p>Table</p>

      <h4>Update Placement Types</h4>

      <div>
        <form  className={classes.root} noValidate autoComplete="off">
          <TextField id="outlined-basic" label="Add New Placement Type" variant="outlined" />
          <Fab className={classes.root} color="primary" aria-label="add">
            <AddIcon />
          </Fab>
        </form>
      </div>

      <p>Table</p>
    </div>
  )
}
