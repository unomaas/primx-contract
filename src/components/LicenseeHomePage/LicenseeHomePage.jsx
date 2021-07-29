import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './LicenseeHomePage.css';

//imports for MUI
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { makeStyles } from '@material-ui/core/styles';
import { useStyles } from '../MuiStyling/MuiStyling';
import { ToggleButtonGroup, ToggleButton } from '@material-ui/lab';


// CUSTOM COMPONENTS
import EstimateCreate from '../EstimateCreate/EstimateCreate';
import EstimateLookup from '../EstimateLookup/EstimateLookup';

const handleButtonState = (event, selection) => {
  console.log('In handleButtonState, selection:', selection);
  setButtonState(selection);
  console.log('In handleButtonState, buttonState:', buttonState);
  history.push(`/${selection}`);
}

function LicenseeHomePage() {

  const history = useHistory();

  // toggle button states
  const [selectedCreate, setSelectedCreate] = React.useState(true);
  const [selectedLookup, setSelectedLookup] = React.useState(false);
  const [buttonState, setButtonState] = useState(`create`);
  const classes = useStyles();

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

      <EstimateCreate /> 
      <EstimateLookup />     

    </div>
  );
}

export default LicenseeHomePage;
