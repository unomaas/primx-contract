// *** The Snackbar Manager is a component that lets us use Material-UI Snackbar Alerts throughout the entire app.  It requires having a snack.reducer.js to call out to, and having the Snackbar Manager loaded into the highest level of your app (for less redundancy.) ***

//#region ⬇⬇ All document setup, below:
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
//#endregion ⬆⬆ All document setup above.


export default function MuiSnackbarManager() {
  //#region ⬇⬇ All state variables below:
  const dispatch = useDispatch();
  const snack = useSelector(store => store.snackBar);
  //#endregion ⬆⬆ All state variables above. 

  
  //#region ⬇⬇ Event handlers below:
  /** ⬇ handleClose:
   * Functionality event handler for the MUI Snackbar, this will close the pop-up notification. 
   */
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    } // End if statement
    dispatch({ type: 'SET_CLOSE' })
  }; // End handleClose
  //#endregion ⬆⬆ Event handlers above. 


  // ⬇ Rendering:
  return (
    <Snackbar
      open={snack.open}
      autoHideDuration={6000}
			disableWindowBlurListener={true}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert
        variant={snack.variant}
        onClose={handleClose}
        severity={snack.severity}
      >
        {snack.message}
      </Alert>
    </Snackbar>
  ) // End return
} // End SnackbarManager
