//#region ⬇⬇ All document setup, below:
// ⬇ Dependent Functionality:
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useStyles } from '../MuiStyling/MuiStyling';
import { ToggleButtonGroup, ToggleButton } from '@material-ui/lab';
import { useSelector, useDispatch } from 'react-redux';
//#endregion ⬆⬆ All document setup above.



export default function ButtonToggle() {
  //#region ⬇⬇ All state variables below:
  const history = useHistory();
  const buttonState = useSelector(store => store.estimatesReducer.buttonState);
  // toggle button states
  const dispatch = useDispatch();
  const classes = useStyles();

  //#endregion ⬆⬆ All state variables above. 


  //#region ⬇⬇ Event handlers below:
  /** ⬇ handleButtonState:
   * Will set the state of the button to be whatever selection their at, to ensure it's always current no matter which view they access Create or Look-up views from. 
   */
  const handleButtonState = (event, selection) => {
    // ⬇ Validation to make sure it's not empty: 
    if (selection !== null) {
      dispatch({
        type: 'SET_BUTTON_STATE',
        payload: selection
      });
      // Push them to the right page:
      history.push(`/${selection}`);
      // And clear all of the reducer data on click: 
      dispatch({ type: "CLEAR_ALL_STALE_DATA" });
    } // End if statement
  } // End handleButtonState
  //#endregion ⬆⬆ Event handlers above. 


  // ⬇ Rendering below:
  return (
    <div id="ToggleButtonGroup">
      <ToggleButtonGroup
        exclusive
        onChange={handleButtonState}
        value={buttonState}
        size="small"
      // style={{fontSize: "11px"}}
      >
        <ToggleButton
          style={{
            fontFamily: 'Lexend Tera',
            // fontSize: '11px'
          }}
          value="create"
        >
          Create New Estimate
        </ToggleButton>

        <ToggleButton
          style={{
            fontFamily: 'Lexend Tera',
            // fontSize: '5px'
          }}
          value="lookup"
        >
          Search For Estimate
        </ToggleButton>

        <ToggleButton
          style={{
            fontFamily: 'Lexend Tera',
            // fontSize: '5px'
            // size="small"
          }}
          value="combine"
        >
          Combine Estimates
        </ToggleButton>
      </ToggleButtonGroup>
    </div>
  );
};


