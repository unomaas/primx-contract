import React from 'react'

import AdminUpdates from './AdminUpdates';

//imports for MUI
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';



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

      <div className={classes.root}>
      <Button variant="contained">Default</Button>
      </div>

      <p>Table</p>

      <h4>Update Placement Types</h4>

      <p>Table</p>
    </div>
  )
}
