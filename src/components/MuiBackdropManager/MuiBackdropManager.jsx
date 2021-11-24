// *** The Backdrop Manager is what lets us use a loading screen to hide the data GET's and state transfers. ***

//#region ⬇⬇ All document setup, below:
import React from 'react';
import { useSelector } from 'react-redux';
import { Backdrop } from '@material-ui/core';
import Nav from '../Nav/Nav';
//#endregion ⬆⬆ All document setup above.


export default function MuiBackdropManager() {
  //#region ⬇⬇ All state variables below:
  const backdropState = useSelector(store => store.backdropReducer.backdropReducer);
  //#endregion ⬆⬆ All state variables above. 

  // ⬇ Rendering:
  return (
    // <div className="App">
    // <Nav />

      <Backdrop
        open={backdropState}
        style={{zIndex: "9"}}
      >
        <img
          src="./images/PrimXAnimation.png"
          alt="PrimX Loading Animation"
        />
      </Backdrop>
    // </div>
  ) // End return
} // End SnackbarManager
