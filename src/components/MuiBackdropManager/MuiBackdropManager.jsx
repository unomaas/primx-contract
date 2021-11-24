// *** The Snackbar Manager is a component that lets us use Material-UI Snackbar Alerts throughout the entire app.  It requires having a snack.reducer.js to call out to, and having the Snackbar Manager loaded into the highest level of your app (for less redundancy.) ***

//#region ⬇⬇ All document setup, below:
import React from 'react';
import { useSelector } from 'react-redux';
import { Backdrop } from '@material-ui/core';
import LoadingAnimation from './LoadingAnimation';
//#endregion ⬆⬆ All document setup above.


export default function MuiBackdropManager() {
  //#region ⬇⬇ All state variables below:
  const backdropState = useSelector(store => store.backdropReducer);
  //#endregion ⬆⬆ All state variables above. 

  // ⬇ Rendering:
  return (
    <Backdrop
      open={backdropState}
      style={{
        zIndex: "9",
        // color: "#E1251B"
        // rgba: "(0, 255, 0, .1)"
      }}
    >
      {/* <LoadingAnimation /> */}
      <img
        // className='GenocchioImage'
        src="./images/PrimXAnimation.png"
        alt="PrimX Loading Animation"
      />
    </Backdrop>
  ) // End return
} // End SnackbarManager
