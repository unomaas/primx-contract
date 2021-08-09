import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

//imports for MUI
import { ToggleButtonGroup, ToggleButton } from '@material-ui/lab';

export default function ButtonToggle() {

  const history = useHistory();
  const buttonState = useSelector(store => store.estimatesReducer.buttonState);

  // toggle button states
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


