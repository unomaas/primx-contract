import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Button, MenuItem, TextField, InputLabel, Select, Radio, RadioGroup, FormControl, FormLabel, FormControlLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid, InputAdornment } from '@material-ui/core';


import LicenseeHomePage from '../LicenseeHomePage/LicenseeHomePage';
import ButtonToggle from '../ButtonToggle/ButtonToggle';

export default function EstimateLookup() {
  const companies = useSelector(store => store.companies);

  const dispatch = useDispatch();
  const history = useHistory();
  useEffect(() => {
    // Make the toggle button show this selection:
    dispatch({ type: 'SET_BUTTON_STATE', payload: 'lookup' }),
      dispatch({ type: 'FETCH_COMPANIES' })
  }, []);


  return (
    <div className="EstimateCreate-wrapper">
      {/* <LicenseeHomePage /> */}
      <ButtonToggle />

      <br />

      <Grid container
        spacing={2}
        justifyContent="center"
      >

        <Grid item xs={10}>
          <Paper elevation={3}>
            <TableContainer >
              {/* <h3 className="lexendFont">Search for an Estimate</h3> */}
              <Table size="small">
                <TableBody>

                  <TableRow>
                    <TableCell><b>Licensee/Contractor Name:</b></TableCell>
                    <TableCell>
                      <Select
                        // onChange={event => handleChange('licensee_id', event.target.value)}
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
                    {/* </TableRow>

                  <TableRow> */}
                    <TableCell><b>Estimate Number:</b></TableCell>
                    <TableCell>
                      <TextField
                        onChange={event => handleChange('project_name', event.target.value)}
                        required
                        type="search"
                        size="small"
                        fullWidth
                      />
                    </TableCell>
                    {/* </TableRow>

                  <TableRow> */}
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

        {/* Grid Table #1: Display the Licensee/Project Info Form */}
        <Grid item xs={6}>
          <Paper elevation={3}>
            <TableContainer >
              <h3 className="lexendFont">Licensee & Project Information</h3>
              <Table size="small">
                <TableBody>

                  <TableRow>
                    <TableCell><b>Project Name:</b></TableCell>
                    <TableCell>
                      CONTENT
                      {/* <TextField
                          onChange={event => handleChange('project_name', event.target.value)}
                          required
                          type="search"
                          size="small"
                          fullWidth
                        /> */}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Licensee/Contractor Name:</b></TableCell>
                    <TableCell>
                      CONTENT
                      {/* <Select
                          onChange={event => handleChange('licensee_id', event.target.value)}
                          required
                          size="small"
                          fullWidth
                          defaultValue="0"
                        >
                          <MenuItem value="0">Please Select</MenuItem>
                          {companies.map(companies => {
                            return (<MenuItem value={companies.id}>{companies.licensee_contractor_name}</MenuItem>)
                          }
                          )}
                        </Select> */}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Project General Contractor:</b></TableCell>
                    <TableCell>
                      CONTENT
                      {/* <TextField
                          onChange={event => handleChange('project_general_contractor', event.target.value)}
                          required
                          type="search"
                          size="small"
                          fullWidth
                        /> */}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Project Manager Email:</b></TableCell>
                    <TableCell>
                      CONTENT
                      {/* <TextField
                          onChange={event => handleChange('project_manager_email', event.target.value)}
                          required
                          type="search"
                          size="small"
                          fullWidth
                        /> */}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Project Manager Cell:</b></TableCell>
                    <TableCell>
                      CONTENT
                      {/* <TextField
                          onChange={event => handleChange('project_manager_phone', event.target.value)}
                          required
                          type="number"
                          size="small"
                          fullWidth
                        /> */}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Your Purchase Order #:</b></TableCell>
                    <TableCell>
                      CONTENT
                      {/* <TextField
                          onChange={event => handleChange('po_number', event.target.value)}
                          required
                          type="search"
                          size="small"
                          fullWidth
                        /> */}
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

                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
        {/* End Grid Table #1 */}

        {/* Grid Table #2: Display the Shipping Info Form */}
        <Grid item xs={6}>
          <Paper elevation={3}>
            <TableContainer>
              <h3 className="lexendFont">Lead Time & Shipping Information</h3>
              <Table size="small">
                <TableBody>

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

      </Grid>
      {/* End Master Grid */}

    </div>
  )
}
