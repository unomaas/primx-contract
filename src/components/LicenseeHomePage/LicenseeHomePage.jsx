import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './LicenseeHomePage.css';
import ToggleButton from '@material-ui/lab/ToggleButton';

// CUSTOM COMPONENTS
import RegisterForm from '../AdminRegisterForm/AdminRegisterForm';

function LicenseeHomePage() {
  const [heading, setHeading] = useState('Welcome');
  const history = useHistory();

  // toggle button states
  const [selectedCreate, setSelectedCreate] = React.useState(true);
  const [selectedLook, setSelectedLook] = React.useState(false);

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
              if (selectedCreate){
              return
              } else if (!selectedCreate){
              setSelectedCreate(!selectedCreate);
              setSelectedLook(!selectedLook);
              }
            }}
          > Create New Estimate
          </ToggleButton>


          <ToggleButton
            value="check"
            selected={selectedLook}
            onChange={() => {
              if (selectedLook){
                return
                } else if (!selectedLook){
                setSelectedCreate(!selectedCreate);
                setSelectedLook(!selectedLook);
                }
            }}
          > Look-Up Existing Estimate
          </ToggleButton>
        </div>

      </div>
    </div>
  );
}

export default LicenseeHomePage;
