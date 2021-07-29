import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

//imports for MUI
import { useStyles } from '../MuiStyling/MuiStyling';
import { ToggleButtonGroup, ToggleButton } from '@material-ui/lab';

import { useSelector, useDispatch } from 'react-redux';

export default function ButtonToggle() {

  const history = useHistory();
  const buttonState = useSelector(store => store.estimatesReducer.buttonState);

  // toggle button states
  const classes = useStyles();
  const dispatch = useDispatch();

  const handleButtonState = (event, selection) => {
    console.log('In handleButtonState, selection:', selection);
    if (selection !== null) {
      dispatch({
        type: 'SET_BUTTON_STATE',
        payload: selection
      });
      history.push(`/${selection}`);

    }
  }

  
  return (
    <div className="">
      <ToggleButtonGroup
        exclusive
        onChange={handleButtonState}
        value={buttonState}
        size="small"
      >
        <ToggleButton
          style={{ fontFamily: 'Lexend Tera', fontSize: '11px' }}
          value="create"
        >
          Create New Estimate
        </ToggleButton>
        <ToggleButton
          style={{ fontFamily: 'Lexend Tera', fontSize: '11px' }}
          value="lookup"
        >
          Search For Estimate
        </ToggleButton>
      </ToggleButtonGroup>
    </div>
  );
};


