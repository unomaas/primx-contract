import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Button, MenuItem, TextField, InputLabel, Select, Radio, RadioGroup, FormControl, FormLabel, FormControlLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid, InputAdornment } from '@material-ui/core';


import LicenseeHomePage from '../LicenseeHomePage/LicenseeHomePage';
import ButtonToggle from '../ButtonToggle/ButtonToggle';

export default function EstimateLookup() {
  const companies = useSelector(store => store.companies);
  const [searchQuery, setSearchQuery] = useState({
    licensee_id: "",
    id: ""
  });

  const dispatch = useDispatch();
  const history = useHistory();
  useEffect(() => {
    // Make the toggle button show this selection:
    dispatch({ type: 'SET_BUTTON_STATE', payload: 'lookup' }),
      dispatch({ type: 'FETCH_COMPANIES' })
  }, []);


  const handleChange = (key, value) => {
    console.log('In handleChange, key/value:', key, '/', value);
    setSearchQuery({ ...searchQuery, [key]: value })
  };

  const handleSubmit = () => {
    console.log('In handleSubmit, key/value:')
  };


  console.log('SeachQuery is:', searchQuery);
  return (
    <div className="EstimateCreate-wrapper">
      {/* <LicenseeHomePage /> */}
      <ButtonToggle />

      <br />

      <form onSubmit={handleSubmit}>
        <Grid container
          spacing={2}
          justifyContent="center"
        >

          <Grid item xs={12}>
            <Paper elevation={3}>
              <TableContainer >
                <Table size="small">
                  <TableBody>

                    <TableRow>
                      <TableCell><b>Licensee/Contractor Name:</b></TableCell>
                      <TableCell>
                        <Select
                          onChange={event => handleChange('licensee_id', event.target.value)}
                          required
                          size="small"
                          fullWidth
                          defaultValue="0"
                        >
                          <MenuItem key="0" value="0">Please Select</MenuItem>
                          {companies.map(companies => {
                            return (<MenuItem key={companies.id} value={companies.id}>{companies.licensee_contractor_name}</MenuItem>)
                          }
                          )}
                        </Select>
                      </TableCell>

                      <TableCell><b>Estimate Number:</b></TableCell>
                      <TableCell>
                        <TextField
                          onChange={event => handleChange('id', event.target.value)}
                          required
                          type="search"
                          size="small"
                          fullWidth
                        />
                      </TableCell>

                      <TableCell colSpan={2} align="right">
                        <Button
                          type="submit"
                          // onClick={event => handleSubmit(event)}
                          variant="contained"
                          style={{ fontFamily: 'Lexend Tera', fontSize: '11px' }}
                          color="primary"
                        >
                          Search
                        </Button>
                      </TableCell>
                    </TableRow>

                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      </form>

      <Grid container
        spacing={2}
        justifyContent="center"
      >


        {/* Grid Table #1: Display the Licensee/Project Info Form */}
        <Grid item xs={6}>
          <Paper elevation={3}>
            <TableContainer >
              <h3>Licensee & Project Information</h3>
              <Table size="small">
                <TableBody>

                  <TableRow>
                    <TableCell><b>Project Name:</b></TableCell>
                    <TableCell>
                      All Phase Construction Concrete

                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Licensee/Contractor Name:</b></TableCell>
                    <TableCell>
                      CONTENT
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Project General Contractor:</b></TableCell>
                    <TableCell>
                      CONTENT
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Project Manager Name:</b></TableCell>
                    <TableCell>
                      CONTENT
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Project Manager Email:</b></TableCell>
                    <TableCell>
                      CONTENT
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Project Manager Cell:</b></TableCell>
                    <TableCell>
                      CONTENT
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Floor Type:</b></TableCell>
                    <TableCell>
                      CONTENT
                      {/* <Select
                          onChange={event => handleChange('floor_types_id', event.target.value)}
                          required
                          size="small"
                          fullWidth
                          defaultValue="0"
                        >
                          <MenuItem value="0">Please Select</MenuItem>
                          {floorTypes.map(types => {
                            return (<MenuItem value={types.id}>{types.floor_type}</MenuItem>)
                          })}
                        </Select> */}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Placement Type:</b></TableCell>
                    <TableCell>
                      CONTENT
                      {/* <Select
                          onChange={event => handleChange('placement_types_id', event.target.value)}
                          required
                          size="small"
                          fullWidth
                          defaultValue="0"
                        >
                          <MenuItem value="0">Please Select</MenuItem>
                          {placementTypes.map(placementTypes => {
                            return (<MenuItem value={placementTypes.id}>{placementTypes.placement_type}</MenuItem>)
                          })}
                        </Select> */}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Unit of Measurement:</b></TableCell>
                    <TableCell>
                      CONTENT
                      {/* <FormControl error={error}>
                          <RadioGroup
                            // defaultValue="imperial"
                            style={{ display: 'inline' }}
                            onChange={event => handleMeasurementUnits(event.target.value)}
                          >
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
                          <FormHelperText>{radioError}</FormHelperText>
                        </FormControl> */}
                    </TableCell>
                  </TableRow>

                  {/* </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
       
        <Grid item xs={6}>
          <Paper elevation={3}>
            <TableContainer>
              <h3 className="lexendFont">Lead Time & Shipping Information</h3>
              <Table size="small">
                <TableBody> */}

                  <TableRow>
                    <TableCell><b>Today's Date:</b></TableCell>
                    <TableCell>
                      CONTENT
                      {/* <TextField
                          // ⬇ Won't work with value=today. 
                          // onChange={event => handleChange('date_created', event.target.value)} 
                          required
                          type="date"
                          size="small"
                          fullWidth
                          value={today}
                        /> */}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Anticipated First Pour Date:</b></TableCell>
                    <TableCell>
                      CONTENT
                      {/* <TextField
                          onChange={event => handleChange('anticipated_first_pour_date', event.target.value)}
                          required
                          type="date"
                          size="small"
                          fullWidth
                        /> */}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Lead Time (In Weeks):</b></TableCell>
                    <TableCell>
                      CONTENT
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Shipping Street Address:</b></TableCell>
                    <TableCell>
                      CONTENT
                      {/* <TextField
                          onChange={event => handleChange('ship_to_address', event.target.value)}
                          required
                          type="search"
                          size="small"
                          fullWidth
                        /> */}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Shipping City:</b></TableCell>
                    <TableCell>
                      CONTENT
                      {/* <TextField
                          onChange={event => handleChange('ship_to_city', event.target.value)}
                          required
                          type="search"
                          size="small"
                          fullWidth
                        /> */}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Shipping State/Province:</b></TableCell>
                    <TableCell>
                      CONTENT
                      {/* <Select
                          onChange={event => handleShipping(event.target.value)}
                          required
                          size="small"
                          fullWidth
                          defaultValue="0"
                        >
                          <MenuItem value="0">Please Select</MenuItem>
                          {shippingCosts.map(state => {
                            return (<MenuItem value={state.id}>{state.ship_to_state_province}</MenuItem>)
                          })}
                        </Select> */}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Shipping Zip/Postal Code:</b></TableCell>
                    <TableCell>
                      CONTENT
                      {/* <TextField
                          onChange={event => handleChange('zip_postal_code', event.target.value)}
                          required
                          type="number"
                          size="small"
                          fullWidth
                        /> */}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Shipping Country:</b></TableCell>
                    <TableCell>
                      CONTENT
                      {/* <Select
                          onChange={event => handleChange('country', event.target.value)}
                          required
                          size="small"
                          fullWidth
                          defaultValue="0"
                        >
                          <MenuItem value="0">Please Select</MenuItem>
                          <MenuItem value="United States">United States</MenuItem>
                          <MenuItem value="Canada">Canada</MenuItem>
                        </Select> */}
                    </TableCell>
                  </TableRow>

                  {/* <TableRow>
                      <TableCell colSpan={2} align="right">
                        <Button
                          type="submit"
                          // ⬇⬇⬇⬇ COMMENT THIS CODE IN/OUT FOR FORM VALIDATION:
                          onClick={event => dispatch({ type: 'SET_TABLE_STATE', payload: true })}
                          variant="contained"
                          style={{ fontFamily: 'Lexend Tera', fontSize: '11px' }}
                          color="primary"
                        >
                          Next
                        </Button>
                      </TableCell>
                    </TableRow> */}

                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
        {/* End Grid Table #2 */}

        {/* </Grid>

      <Grid container
          spacing={2}
          justifyContent="center"
        > */}
        <Grid item xs={6}>
          <Paper elevation={3}>
            <TableContainer>
              <h3>Project Quantity Calculations</h3>
              <Table size="small">
                <TableBody>

                  <TableRow>
                    <TableCell><b>Square Feet:</b></TableCell>
                    <TableCell>

                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Thickness (in):</b></TableCell>
                    <TableCell>

                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Cubic Yards:</b></TableCell>
                    <TableCell>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Thickening @ Perimeter (yd³):</b></TableCell>
                    <TableCell>
                      {/* This rounds down in the spreadsheet, and rounds up here: */}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Thickening @ Construction Joints (yd³):</b></TableCell>
                    <TableCell>
                      {/* This rounds down in the spreadsheet, and rounds up here: */}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Subtotal:</b></TableCell>
                    <TableCell>
                      {/* This rounds down in the spreadsheet, and rounds up here: */}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Waste Factor @ 5%:</b></TableCell>
                    <TableCell>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Total Cubic Yards:</b></TableCell>
                    <TableCell>
                    </TableCell>
                  </TableRow>

                </TableBody>
              </Table>
              {/* </TableContainer>
            </Paper>
          </Grid>

          <Grid item xs={6}>
            <Paper elevation={3}>
              <TableContainer> */}
              <h3>Thickened Edge Calculator</h3>
              <p>If applicable, for slabs under 6in.<br />Note: For 'Slab on Insulation', enter "0" for both.</p>
              <Table size="small">

                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell><b>Perimeter</b></TableCell>
                    <TableCell><b>Construction Joint</b></TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  <TableRow>
                    <TableCell><b>Lineal Feet:</b></TableCell>
                    <TableCell>

                    </TableCell>
                    <TableCell>

                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Width (yd³):</b></TableCell>
                    <TableCell>
                      5
                    </TableCell>
                    <TableCell>
                      10
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Additional Thickness (in):</b></TableCell>
                    <TableCell>
                    </TableCell>
                    <TableCell>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Cubic Yards:</b></TableCell>
                    <TableCell>
                    </TableCell>
                    <TableCell>
                    </TableCell>
                  </TableRow>

                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={3}>
            <TableContainer>
              <h3>Materials Table</h3>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell><b>Dosage<br />Rate<br />(yd³)</b></TableCell>
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
                    <TableCell><b>PrīmX DC (lbs)</b></TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>PrīmX Flow (ltrs)</b></TableCell>
                    <TableCell style={{ width: '1em' }}>

                    </TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>PrīmX Steel Fibers (lbs)</b></TableCell>
                    <TableCell style={{ width: '1em' }}>

                    </TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>PrīmX UltraCure Blankets (ft²)</b></TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>PrīmX CPEA (ltrs)</b></TableCell>
                    <TableCell style={{ width: '1em' }}>
                      {/* <TextField
                          onChange={event => handleChange('primx_cpea_dosage_liters', event.target.value)}
                          required
                          type="number"
                          size="small"
                          fullWidth
                        /> */}
                    </TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell><b>TOTALS:</b></TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                  </TableRow>

                  <TableRow>
                    {/* <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>

                      <TableCell colSpan={3} align="right">
                        <Button
                          type="submit"
                          onClick={event => handleCalculateCosts(event)}
                          variant="contained"
                          style={{ fontFamily: 'Lexend Tera', fontSize: '11px' }}
                          color="primary"
                        >
                          Calculate Costs
                        </Button>
                      </TableCell> */}
                    <TableCell colSpan={11} align="right">
                      {/* <Button
                          type="submit"
                          onClick={event => handleCalculateCosts(event)}
                          variant="contained"
                          className={classes.LexendTeraFont11}
                          color="primary"
                        >
                          Calculate Costs
                        </Button>
                        &nbsp; &nbsp;
                        <Button
                          // type="submit"
                          // ⬇⬇⬇⬇ COMMENT THIS CODE IN/OUT FOR FORM VALIDATION:
                          // onClick={event => handleSave(event)}
                          variant="contained"
                          className={classes.LexendTeraFont11}
                          color="secondary"
                        >
                          Save Estimate
                        </Button> */}
                    </TableCell>
                  </TableRow>

                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

    </div>
  )
}
