//#region ⬇⬇ All document setup, below:
// ⬇ File Imports: 
import './EstimateCreate.css';
// ⬇ Dependent Functionality:
import { useDispatch, useSelector } from 'react-redux';
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, MenuItem, TextField, InputLabel, Select, Radio, RadioGroup, FormControl, FormLabel, FormControlLabel } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import { useStyles } from '../MuiStyling/MuiStyling';

//#endregion ⬆⬆ All document setup above.


export default function EstimateCreate() {
  //#region ⬇⬇ All state variables below:
  const dispatch = useDispatch();
  const history = useHistory();
  const classes = useStyles();
  // ⬇ GET on page load:
  // useEffect(() => {
  //   dispatch({ type: 'FETCH_KIT_CATEGORIES' })
  // }, []);
  //#endregion ⬆⬆ All state variables above. 


  //#region ⬇⬇ Event handlers below:
  /** ⬇ handleChange:
   * When the user types, this will set their input to the kit object with keys for each field. 
   */
  const handleChange = (key, value) => {
    console.log('In handleChange, key/value:', key, '/', value);
    // setNewKit({ ...newKit, [key]: value });
  } // End handleChange

  /** ⬇ handleSubmit:
   * When clicked, this will post the object to the DB and send the user back to the dashboard. 
   */
  const handleSubmit = event => {
    console.log('In handleSubmit, newKit:', newKit);
    // ⬇ Don't refresh until submit:
    // event.preventDefault();
    // // ⬇ Sending newPlant to our reducer: 
    // dispatch({ type: 'ADD_NEW_KIT', payload: newKit });
    // // ⬇ Send the user back:
    // history.push('/dashboard');
  } // End handleSubmit
  //#endregion ⬆⬆ Event handles above. 





  return (
    <div className="EstimateCreate-wrapper">
      <p>In Estimate Create</p>

      {/* Project Details (Contactor & Shipping Info) */}
      <div className="EstimateCreate-details-wrapper">

        <form onSubmit={handleSubmit}>
          <div className="EstimateCreate-shipping-info">
            <h3>Project Shipping Info</h3>

            <TextField
              label="Project Name?"
              // helperText="Project Name?"
              // labelId="projectName"
              onChange={event => handleChange('kit_description', event.target.value)}
              required
              type="search"
              margin="dense"
            // inputProps={{ maxLength: 255 }}
            // size="small"
            /> <br />

            <InputLabel id="companyNameLabel">Licensee/Company Name?</InputLabel>
            <Select
              // label="Licensee / Company Name?"
              // defaultValue="Licensee / Company Name?"
              // value="Licensee / Company Name?"
              labelId="companyNameLabel"

              required
            /> <br />

            <TextField
              label="General Contractor?"
              onChange={event => handleChange('kit_description', event.target.value)}
              required
              type="search"
              margin="dense"
            /> <br />

            <TextField
              label="Shipping Address?"
              onChange={event => handleChange('kit_description', event.target.value)}
              required
              type="search"
              margin="dense"
            /> <br />

            <TextField
              label="Shipping City?"
              onChange={event => handleChange('kit_description', event.target.value)}
              required
              type="search"
              margin="dense"
            /> <br />

            <InputLabel id="companyNameLabel">Shipping State/Province?</InputLabel>
            <Select
              label="Shipping State/Province?"
              onChange={event => handleChange('kit_description', event.target.value)}
              required
              type="search"
              margin="dense"
            /> <br />

            <TextField
              label="Shipping Postal Code?"
              onChange={event => handleChange('kit_description', event.target.value)}
              required
              type="search"
              margin="dense"
            /> <br />

            <FormControl>
              <FormLabel>
                Units of Measurement?
              </FormLabel>
              <RadioGroup>

              </RadioGroup>
            </FormControl>

          </div>

          <div className="EstimateCreate-project-info">
            <h3>Project Contactor Info</h3>

            <InputLabel id="companyNameLabel">Today's Date:</InputLabel>
            <TextField
              onChange={event => handleChange('kit_description', event.target.value)}
              required
              type="date"
              margin="dense"
            /> <br />

            <InputLabel id="companyNameLabel">Anticipated Pour Date:</InputLabel>
            <TextField
              onChange={event => handleChange('kit_description', event.target.value)}
              required
              type="date"
              margin="dense"
            /> <br />

            <TextField
              label="Lead Time (In Weeks)?"
              onChange={event => handleChange('kit_description', event.target.value)}
              required
              type="search"
              margin="dense"
            /> <br />

            <TextField
              label="Project Manager Name?"
              onChange={event => handleChange('kit_description', event.target.value)}
              required
              type="search"
              margin="dense"
            /> <br />

            <TextField
              label="Project Manager Email?"
              onChange={event => handleChange('kit_description', event.target.value)}
              required
              type="search"
              margin="dense"
            /> <br />

            <TextField
              label="Project Manager Cell?"
              onChange={event => handleChange('kit_description', event.target.value)}
              required
              type="search"
              margin="dense"
            /> <br />

            <TextField
              label="Your Purchase Order Number?"
              onChange={event => handleChange('kit_description', event.target.value)}
              required
              type="search"
              margin="dense"
            /> <br />

            <InputLabel id="companyNameLabel">Floor Type?</InputLabel>
            <Select
              label="Shipping State/Province?"
              onChange={event => handleChange('kit_description', event.target.value)}
              required
              type="search"
              margin="dense"
            /> <br />

            <InputLabel id="companyNameLabel">Placement Type?</InputLabel>
            <Select
              label="Shipping State/Province?"
              onChange={event => handleChange('kit_description', event.target.value)}
              required
              type="search"
              margin="dense"
            /> <br />

            <br />
            <Button variant="outlined">
              Submit
            </Button>
          </div>
        </form>

      </div>

      <div>
        <form>


        </form>
      </div>

    </div>
  )
}
