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
  //#endregion ⬆⬆ All state variables above. 


  //#region ⬇⬇ Event handlers below:
  /** ⬇ handleButtonState:
   * Will set the state of the button to be whatever selection their at, to ensure it's always current no matter which view they access Create or Look-up views from. 
   */
  const handleButtonState = (event, selection) => {
    console.log('In handleButtonState, selection:', selection);
    // ⬇ Validation to make sure it's not empty: 
    if (selection !== null) {
      dispatch({
        type: 'SET_BUTTON_STATE',
        payload: selection
      });
      history.push(`/${selection}`);
    } // End if statement
  } // End handleButtonState
  //#endregion ⬆⬆ Event handlers above. 


  // ⬇ Rendering below:
  return (
    <div className="">
      <ToggleButtonGroup
        exclusive
        onChange={handleButtonState}
        value={buttonState}
        size="small"
      >
        <ToggleButton
          style={{
            fontFamily: 'Lexend Tera',
            fontSize: '11px'
          }}
          value="create"
        >
          Create New Estimate
        </ToggleButton>
        <ToggleButton
          style={{
            fontFamily: 'Lexend Tera',
            fontSize: '11px'
          }}
          value="lookup"
        >
          Search For Estimate
        </ToggleButton>
      </ToggleButtonGroup>
    </div>
  );
};


