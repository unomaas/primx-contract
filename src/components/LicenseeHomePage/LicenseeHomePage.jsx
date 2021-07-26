import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './LicenseeHomePage.css';
import ToggleButton from '@material-ui/lab/ToggleButton';

//imports for MUI
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { makeStyles } from '@material-ui/core/styles';


// CUSTOM COMPONENTS
import EstimateCreate from '../EstimateCreate/EstimateCreate';
import EstimateLookup from '../EstimateLookup/EstimateLookup';

function LicenseeHomePage() {

  const history = useHistory();

  // toggle button states
  const [selectedCreate, setSelectedCreate] = React.useState(true);
  const [selectedLookup, setSelectedLookup] = React.useState(false);

  const onLogin = (event) => {
    history.push('/login');
  };


  return (
    <div className="container">
      <center>
        <h1>LICENSEE HOME PAGE?</h1>
      </center>

      <div>
        <ButtonGroup color="primary" aria-label="outlined primary button group">

          <ToggleButton
            value="check"
            selected={selectedCreate}
            onChange={() => {
              if (selectedCreate) {
                return
              } else if (!selectedCreate) {
                setSelectedCreate(!selectedCreate);
                setSelectedLookup(!selectedLookup);
              }
            }}
          > Create New Estimate
          </ToggleButton>


          <ToggleButton
            value="check"
            selected={selectedLookup}
            onChange={() => {
              if (selectedLookup) {
                return
              } else if (!selectedLookup) {
                setSelectedCreate(!selectedCreate);
                setSelectedLookup(!selectedLookup);
              }
            }}
          > Look-Up Existing Estimate
          </ToggleButton>
        </ButtonGroup>
      </div>
      {/* Conditional Rendering */}
        {selectedCreate && <EstimateCreate />}
        {selectedLookup && <EstimateLookup />}

    </div>

  );
}

export default LicenseeHomePage;
