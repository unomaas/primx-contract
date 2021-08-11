import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

//imports for MUI
import { ToggleButtonGroup, ToggleButton } from '@material-ui/lab';


// CUSTOM COMPONENTS
import EstimateCreate from '../EstimateCreate/EstimateCreate';
import EstimateLookup from '../EstimateLookup/EstimateLookup';

const handleButtonState = (event, selection) => {
  setButtonState(selection);
  history.push(`/${selection}`);
}

function LicenseeHomePage() {

  const history = useHistory();

  // toggle button states
  const [buttonState, setButtonState] = useState(`create`);

  const onLogin = (event) => {
    history.push('/login');
  };


  return (
    <div className="container">

      <ToggleButtonGroup
        exclusive
        onChange={handleButtonState}
        value={buttonState}
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

      <EstimateCreate />
      <EstimateLookup />

    </div>
  );
}

export default LicenseeHomePage;
