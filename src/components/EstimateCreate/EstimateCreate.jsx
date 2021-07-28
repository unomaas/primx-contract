//#region ⬇⬇ All document setup, below:
// ⬇ File Imports: 
import './EstimateCreate.css';
// ⬇ Dependent Functionality:
import { useDispatch, useSelector } from 'react-redux';
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, MenuItem, TextField, InputLabel, Select, Radio, RadioGroup, FormControl, FormLabel, FormControlLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid } from '@material-ui/core';
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


      <Grid container
        spacing={3}
        justify="center"
        alignItems="center"
        component={Paper}
        // style={{ margin: '0' }}
      >

        <Grid item xs={12} >
          <h3 className="lexendFont">Project Info</h3>
        </Grid>

        <Grid container item xs={6} alignItems="center">

          <Grid item xs={6}>
            <b>Licensee/Contractor Name:</b>
          </Grid>
          <Grid item xs={6}>
            <TextField
              onChange={event => handleChange('kit_description', event.target.value)}
              required
              type="search"
              size="small"
            />
          </Grid>

          <Grid item xs={6}>
            <b>Project General Contractor:</b>
          </Grid>
          <Grid item xs={6}>
            <TextField
              onChange={event => handleChange('kit_description', event.target.value)}
              required
              type="search"
              size="small"
            />
          </Grid>

          <Grid item xs={6}>
            <b>Project Name:</b>
          </Grid>
          <Grid item xs={6}>
            <TextField
              onChange={event => handleChange('kit_description', event.target.value)}
              required
              type="search"
              size="small"
            />
          </Grid>

          <Grid item xs={6}>
            <b>Project Manager Name:</b>
          </Grid>
          <Grid item xs={6}>
            <TextField
              onChange={event => handleChange('kit_description', event.target.value)}
              required
              type="search"
              size="small"
            />
          </Grid>

          <Grid item xs={6}>
            <b>Project Manager Email:</b>
          </Grid>
          <Grid item xs={6}>
            <TextField
              onChange={event => handleChange('kit_description', event.target.value)}
              required
              type="search"
              size="small"
            />
          </Grid>

          <Grid item xs={6}>
            <b>Project Manager Cell:</b>
          </Grid>
          <Grid item xs={6}>
            <TextField
              onChange={event => handleChange('kit_description', event.target.value)}
              required
              type="search"
              size="small"
            />
          </Grid>

          <Grid item xs={6}>
            <b>Your Purchase Order #:</b>
          </Grid>
          <Grid item xs={6}>
            <TextField
              onChange={event => handleChange('kit_description', event.target.value)}
              required
              type="search"
              size="small"
            />
          </Grid>

          <Grid item xs={6}>
            <b>Floor Type:</b>
          </Grid>
          <Grid item xs={6}>
            <TextField
              onChange={event => handleChange('kit_description', event.target.value)}
              required
              type="search"
              size="small"
            />
          </Grid>

          <Grid item xs={6}>
            <b>Placement Type:</b>
          </Grid>
          <Grid item xs={6}>
            <TextField
              onChange={event => handleChange('kit_description', event.target.value)}
              required
              type="search"
              size="small"
            />
          </Grid>

        </Grid>

        <Grid container item xs={6} alignItems="center">

          <Grid item xs={6}>
            <b>Today's Date:</b>
          </Grid>
          <Grid item xs={6}>
            <TextField
              onChange={event => handleChange('kit_description', event.target.value)}
              required
              type="search"
              size="small"
            />
          </Grid>

          <Grid item xs={6}>
            <b>Anticipated First Pour Date:</b>
          </Grid>
          <Grid item xs={6}>
            <TextField
              onChange={event => handleChange('kit_description', event.target.value)}
              required
              type="search"
              size="small"
            />
          </Grid>

          <Grid item xs={6}>
            <b>Lead Time (In Weeks):</b>
          </Grid>
          <Grid item xs={6}>
            <TextField
              onChange={event => handleChange('kit_description', event.target.value)}
              required
              type="search"
              size="small"
            />
          </Grid>

          <Grid item xs={6}>
            <b>Shipping Street Address:</b>
          </Grid>
          <Grid item xs={6}>
            <TextField
              onChange={event => handleChange('kit_description', event.target.value)}
              required
              type="search"
              size="small"
            />
          </Grid>

          <Grid item xs={6}>
            <b>Shipping City:</b>
          </Grid>
          <Grid item xs={6}>
            <TextField
              onChange={event => handleChange('kit_description', event.target.value)}
              required
              type="search"
              size="small"
            />
          </Grid>

          <Grid item xs={6}>
            <b>Shipping State/Province:</b>
          </Grid>
          <Grid item xs={6}>
            <TextField
              onChange={event => handleChange('kit_description', event.target.value)}
              required
              type="search"
              size="small"
            />
          </Grid>

          <Grid item xs={6}>
            <b>Shipping Country:</b>
          </Grid>
          <Grid item xs={6}>
            <TextField
              onChange={event => handleChange('kit_description', event.target.value)}
              required
              type="search"
              size="small"
            />
          </Grid>

          <Grid item xs={6}>
            <b>Unit of Measurement:</b>
          </Grid>
          <Grid item xs={6}>
            <TextField
              onChange={event => handleChange('kit_description', event.target.value)}
              required
              type="search"
              size="small"
            />
          </Grid>

        </Grid>
        {/* 
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
        <h3 className="lexendFont">Project Contactor Info</h3>

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
        </Button> */}
        {/* </div>
      </div> */}
      </Grid>

      <br /> <br />


      <Grid container
        spacing={3}
        justify="center"
      >
        <Grid item xs={6}>
          <TableContainer component={Paper}>
            <h3 className="lexendFont">Project Quantity Calculations</h3>
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
                  <TableCell><b>Thickening @ Perimeter (CY)</b></TableCell>
                  <TableCell>CALC#</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><b>Thickening @ Construction Joints (CY)</b></TableCell>
                  <TableCell>CALC#</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><b>Subtotal</b></TableCell>
                  <TableCell>CALC#</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><b>Waste Factor @ 5%</b></TableCell>
                  <TableCell>CALC#</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          {/* </div> */}
        </Grid>

        <Grid item xs={6}>
          {/* <div className="EstimateCreate-table-2"> */}

          <TableContainer component={Paper}>
            <h3 className="lexendFont">Thickened Edge Calculator</h3>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell><b>Perimeter</b></TableCell>
                  <TableCell><b>Construction Joint</b></TableCell>
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
                  <TableCell><b>Additional Thickness (Inches)</b></TableCell>
                  <TableCell>CALC#</TableCell>
                  <TableCell>CALC#</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><b>Cubic Thickness (Inches)</b></TableCell>
                  <TableCell>CALC#</TableCell>
                  <TableCell>CALC#</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          {/* </div> */}
        </Grid>

        {/* <div className="EstimateCreate-table-3"> */}
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <h3 className="lexendFont">Materials Table</h3>
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
                  <TableCell><b>PrīmX Steel Fibers</b></TableCell>
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
        </Grid>
        {/* </div> */}

        {/* </div> */}
      </Grid>
    </div>
  )
}
