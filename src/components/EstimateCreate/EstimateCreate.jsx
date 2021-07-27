//#region ⬇⬇ All document setup, below:
// ⬇ File Imports: 
import './EstimateCreate.css';
// ⬇ Dependent Functionality:
import { useDispatch, useSelector } from 'react-redux';
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, MenuItem, TextField, InputLabel, Select, Radio, RadioGroup, FormControl, FormLabel, FormControlLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@material-ui/core';
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
    console.log('In handleSubmit');
    // ⬇ Don't refresh until submit:
    event.preventDefault();
    // // ⬇ Sending newPlant to our reducer: 
    // dispatch({ type: 'ADD_NEW_KIT', payload: newKit });
    // // ⬇ Send the user back:
    // history.push('/dashboard');
  } // End handleSubmit
  //#endregion ⬆⬆ Event handles above. 





  return (
    <div className="EstimateCreate-wrapper">
      {/* <p>In Estimate Create</p> */}

      {/* Project Details (Contactor & Shipping Info) */}
      <div className="EstimateCreate-details-wrapper">

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

          <FormControl required>
            <FormLabel>
              Units of Measurement?
            </FormLabel>
            <RadioGroup>
              <FormControlLabel
                label="Imperial"
                value="imperial"
                control={<Radio />}
              />
              <FormControlLabel
                label="Metric"
                value="metric"
                control={<Radio />}
              />
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
          <Button
            type="submit"
            // onClick={event => handleSubmit(event)}
            variant="outlined"
            style={{ fontFamily: 'Lexend Tera', fontSize: '11px' }}
          >
            Submit
          </Button>
        </div>

      </div>

      {/* <TextField
            label="Square Feet?"
            onChange={event => handleChange('kit_description', event.target.value)}
            required
            type="search"
            margin="dense"
          /> <br />

          <TextField
            label="Thickness (in Yards)?"
            onChange={event => handleChange('kit_description', event.target.value)}
            required
            type="search"
            margin="dense"
          /> <br />

          <p>Cubic Yards: CALC#</p>
          <p>Thickening @ Perimeter (CY): CALC#</p>
          <p>Thickening @ Construction Joint (CY): CALC#</p>
          <p>Subtotal: CALC#</p>
          <p>Waste Factor @ 5%: CALC#</p>
          <p>Total Cubic Yards: CALC#</p> */}
      <div>

        <div className="EstimateCreate-table-wrappers">

          <div className="EstimateCreate-table-three">
            <h3>Project Quantity Calculations</h3>
            <TableContainer>
              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell><b>Square Feet</b></TableCell>
                    <TableCell>_____</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><b>Thickness (Inches)</b></TableCell>
                    <TableCell>_____</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><b>Cubic Yards</b></TableCell>
                    <TableCell>CALC#</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><b>Thickening @<br />Perimeter (CY)</b></TableCell>
                    <TableCell>CALC#</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><b>Thickening @<br />Construction Joints (CY)</b></TableCell>
                    <TableCell>CALC#</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><b>Subtotal</b></TableCell>
                    <TableCell>CALC#</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><b>Waste Factor @<br />5%</b></TableCell>
                    <TableCell>CALC#</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </div>

          <div className="EstimateCreate-table-one">
            <h3>Thickened Edge Calculator</h3>
            <TableContainer >
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell><b>Perimeter</b></TableCell>
                    <TableCell><b>Construction<br />Joint</b></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody className="testTable">
                  <TableRow>
                    <TableCell><b>Lineal Feet</b></TableCell>
                    <TableCell>_____</TableCell>
                    <TableCell>_____</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><b>Width</b></TableCell>
                    <TableCell>CALC#</TableCell>
                    <TableCell>CALC#</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><b>Additional<br />Thickness<br />(Inches)</b></TableCell>
                    <TableCell>CALC#</TableCell>
                    <TableCell>CALC#</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><b>Cubic<br />Thickness<br />(Inches)</b></TableCell>
                    <TableCell>CALC#</TableCell>
                    <TableCell>CALC#</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            {/* <TableContainer >
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell><b>Lineal<br />Feet</b></TableCell>
                    <TableCell><b>Width</b></TableCell>
                    <TableCell><b>Additional<br />Thickness</b></TableCell>
                    <TableCell><b>Cubic<br />Yards</b></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody className="testTable">
                  <TableRow>
                    <TableCell><b>Perimeter</b></TableCell>
                    <TableCell>_____</TableCell>
                    <TableCell>CALC#</TableCell>
                    <TableCell>CALC#</TableCell>
                    <TableCell>CALC#</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><b>Construction Joint</b></TableCell>
                    <TableCell>_____</TableCell>
                    <TableCell>CALC#</TableCell>
                    <TableCell>CALC#</TableCell>
                    <TableCell>CALC#</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer> */}
          </div>

          <div className="EstimateCreate-table-two">
            <h3>Materials Table</h3>
            <TableContainer style={{ maxWidth: "72em" }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell><b>Dosage<br />Rate</b></TableCell>
                    <TableCell><b>Total<br />Amount</b></TableCell>
                    <TableCell><b>Packaging<br />Capacity</b></TableCell>
                    <TableCell><b>Packages<br />Needed</b></TableCell>
                    <TableCell><b>Total<br />Order<br />Quantity</b></TableCell>
                    <TableCell><b>Materials<br />Price</b></TableCell>
                    <TableCell><b>Total<br />Materials<br />Price</b></TableCell>
                    <TableCell><b>Containers</b></TableCell>
                    <TableCell><b>Shipping<br />Estimate</b></TableCell>
                    <TableCell><b>Total<br />Cost</b></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell><b>PrīmX DC</b></TableCell>
                    <TableCell>CALC#</TableCell>
                    <TableCell>CALC#</TableCell>
                    <TableCell>CALC#</TableCell>
                    <TableCell>CALC#</TableCell>
                    <TableCell>CALC#</TableCell>
                    <TableCell>CALC#</TableCell>
                    <TableCell>CALC#</TableCell>
                    <TableCell>CALC#</TableCell>
                    <TableCell>CALC#</TableCell>
                    <TableCell>CALC#</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><b>PrīmX Flow</b></TableCell>
                    <TableCell>_____</TableCell>
                    <TableCell>CALC#</TableCell>
                    <TableCell>CALC#</TableCell>
                    <TableCell>CALC#</TableCell>
                    <TableCell>CALC#</TableCell>
                    <TableCell>CALC#</TableCell>
                    <TableCell>CALC#</TableCell>
                    <TableCell>CALC#</TableCell>
                    <TableCell>CALC#</TableCell>
                    <TableCell>CALC#</TableCell>

                  </TableRow>
                  <TableRow>
                    <TableCell><b>PrīmX Steel<br />Fibers</b></TableCell>
                    <TableCell>_____</TableCell>
                    <TableCell>CALC#</TableCell>
                    <TableCell>CALC#</TableCell>
                    <TableCell>CALC#</TableCell>
                    <TableCell>CALC#</TableCell>
                    <TableCell>CALC#</TableCell>
                    <TableCell>CALC#</TableCell>
                    <TableCell>CALC#</TableCell>
                    <TableCell>CALC#</TableCell>
                    <TableCell>CALC#</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><b>PrīmX UltraCure Blankets</b></TableCell>
                    <TableCell>CALC#</TableCell>
                    <TableCell>CALC#</TableCell>
                    <TableCell>CALC#</TableCell>
                    <TableCell>CALC#</TableCell>
                    <TableCell>CALC#</TableCell>
                    <TableCell>CALC#</TableCell>
                    <TableCell>CALC#</TableCell>
                    <TableCell>CALC#</TableCell>
                    <TableCell>CALC#</TableCell>
                    <TableCell>CALC#</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><b>PrīmX CPEA</b></TableCell>
                    <TableCell>_____</TableCell>
                    <TableCell>CALC#</TableCell>
                    <TableCell>CALC#</TableCell>
                    <TableCell>CALC#</TableCell>
                    <TableCell>CALC#</TableCell>
                    <TableCell>CALC#</TableCell>
                    <TableCell>CALC#</TableCell>
                    <TableCell>CALC#</TableCell>
                    <TableCell>CALC#</TableCell>
                    <TableCell>CALC#</TableCell>
                  </TableRow>


                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>


      </div>

    </div>
  )
}
