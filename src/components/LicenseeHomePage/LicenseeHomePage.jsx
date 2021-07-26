import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './LicenseeHomePage.css';
import ToggleButton from '@material-ui/lab/ToggleButton';

// CUSTOM COMPONENTS
import EstimateCreate from '../EstimateCreate/EstimateCreate';
import EstimateLookup from '../EstimateLookup/EstimateLookup';

function LicenseeHomePage() {
  const [heading, setHeading] = useState('Welcome');
  const history = useHistory();

  // toggle button states
  const [selectedCreate, setSelectedCreate] = React.useState(true);
  const [selectedLookup, setSelectedLookup] = React.useState(false);

  const onLogin = (event) => {
    history.push('/login');
  };



  return (
    <div className="container">
      <h2>{heading}</h2>

      <div className="grid">
        <div className="grid-col grid-col_8">

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
        </div>

        {/* Conditional Rendering */}
        {selectedCreate && <EstimateCreate />}
        {selectedLookup && <EstimateLookup />}

      </div>
    </div>
  );
}

export default LicenseeHomePage;
