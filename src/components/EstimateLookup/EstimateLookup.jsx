import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';


import LicenseeHomePage from '../LicenseeHomePage/LicenseeHomePage';
import ButtonToggle from '../ButtonToggle/ButtonToggle';

export default function EstimateLookup() {

  const dispatch = useDispatch();
  const history = useHistory();
  useEffect(() => {
    // Make the toggle button show this selection:
    dispatch({ type: 'SET_BUTTON_STATE', payload: 'lookup' });
  }, []);


  return (
    <div className="EstimateCreate-wrapper">
      {/* <LicenseeHomePage /> */}
      <ButtonToggle />
      <p>In Estimate Lookup</p>
    </div>
  )
}
