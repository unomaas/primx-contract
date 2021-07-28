//#region ⬇⬇ All document setup, below:
// ⬇ File Imports: 
import './EstimateCreate.css';
// ⬇ Dependent Functionality:
import { useDispatch, useSelector } from 'react-redux';
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, MenuItem, TextField, InputLabel, Select, Radio, RadioGroup, FormControl, FormLabel, FormControlLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid, InputAdornment } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import { useStyles } from '../MuiStyling/MuiStyling';

//#endregion ⬆⬆ All document setup above.


export default function EstimateCreate() {
  //#region ⬇⬇ All state variables below:
  const dispatch = useDispatch();
  const history = useHistory();
  const classes = useStyles();
  const today = new Date().toISOString().substring(0, 10);

  const companies = useSelector(store => store.companies);
  const shippingCosts = useSelector(store => store.shippingCosts);
  const floorTypes = useSelector(store => store.floorTypes);
  const placementTypes = useSelector(store => store.placementTypes);

  // ⬇ GET on page load:
  useEffect(() => {
    // Liscensee/Company Name Call
    dispatch({ type: 'FETCH_COMPANIES' }),
      // State/Province Call
      dispatch({ type: 'FETCH_SHIPPING_COSTS' }),
      // Floor Type Call
      dispatch({ type: 'FETCH_FLOOR_TYPES' }),
      // Placement Type Call
      dispatch({ type: 'FETCH_PLACEMENT_TYPES' })
  }, []);
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
        spacing={2}
        justify="center"
      >

        {/* Grid Table #1: Display the Licensee/Project Info Form */}
        <Grid item xs={6}>
          <TableContainer component={Paper}>
            <h3 className="lexendFont">Licensee & Project Information</h3>
            <Table size="small">
              <TableBody>

                <TableRow>
                  <TableCell><b>Licensee/Contractor Name:</b></TableCell>
                  <TableCell>
                    <TextField
                      onChange={event => handleChange('kit_description', event.target.value)}
                      required
                      type="search"
                      size="small"
                      fullWidth
                    />
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell><b>Project General Contractor:</b></TableCell>
                  <TableCell>
                    <TextField
                      onChange={event => handleChange('kit_description', event.target.value)}
                      required
                      type="search"
                      size="small"
                      fullWidth
                    />
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell><b>Project Name:</b></TableCell>
                  <TableCell>
                    <TextField
                      onChange={event => handleChange('kit_description', event.target.value)}
                      required
                      type="search"
                      size="small"
                      fullWidth
                    />
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell><b>Project Manager Email:</b></TableCell>
                  <TableCell>
                    <TextField
                      onChange={event => handleChange('kit_description', event.target.value)}
                      required
                      type="search"
                      size="small"
                      fullWidth
                    />
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell><b>Project Manager Cell:</b></TableCell>
                  <TableCell>
                    <TextField
                      onChange={event => handleChange('kit_description', event.target.value)}
                      required
                      type="search"
                      size="small"
                      fullWidth
                    />
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell><b>Tour Purchase Order #:</b></TableCell>
                  <TableCell>
                    <TextField
                      onChange={event => handleChange('kit_description', event.target.value)}
                      required
                      type="search"
                      size="small"
                      fullWidth
                    />
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell><b>Floor Type:</b></TableCell>
                  <TableCell>
                    <Select
                      onChange={event => handleChange('kit_description', event.target.value)}
                      required
                      size="small"
                      fullWidth
                      defaultValue="1"
                    >
                      {floorTypes.map(types => {
                        return (<MenuItem value={types.id}>{types.floor_type}</MenuItem>)
                      }
                      )}

                      {/* <MenuItem value="1">Slab on Grade - Interior</MenuItem>
                      <MenuItem value="2">Slab on Grade - Exterior</MenuItem>
                      <MenuItem value="3">Slab on Insulation</MenuItem>
                      <MenuItem value="4">Slab on Piles - Interior</MenuItem>
                      <MenuItem value="5">Slab on Grade - Exterior</MenuItem> */}
                    </Select>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell><b>Placement Type:</b></TableCell>
                  <TableCell>
                    <Select
                      onChange={event => handleChange('kit_description', event.target.value)}
                      required
                      size="small"
                      fullWidth
                      defaultValue="1"
                    >
                      {placementTypes.map(placementTypes => {
                        return (<MenuItem value={placementTypes.id}>{placementTypes.placement_type}</MenuItem>)
                      }
                      )}
                      {/* <MenuItem value="1">Truck Discharge</MenuItem>
                      <MenuItem value="2">Pump</MenuItem>
                      <MenuItem value="3">Buggy</MenuItem>
                      <MenuItem value="4">Conveyor</MenuItem> */}
                    </Select>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell><b>Unit of Measurement:</b></TableCell>
                  <TableCell>
                    <FormControl required>
                      <RadioGroup defaultValue="imperial" style={{ display: 'inline' }}>
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
                  </TableCell>
                </TableRow>

              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        {/* End Grid Table #1 */}


        {/* Grid Table #2: Display the Shipping Info Form */}
        <Grid item xs={6}>
          <TableContainer component={Paper}>
            <h3 className="lexendFont">Lead Time & Shipping Information</h3>
            <Table size="small">
              <TableBody>

                <TableRow>
                  <TableCell><b>Today's Date:</b></TableCell>
                  <TableCell>
                    <TextField
                      onChange={event => handleChange('kit_description', event.target.value)}
                      required
                      type="date"
                      size="small"
                      fullWidth
                      value={today}
                    />
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell><b>Anticipated First Pour Date:</b></TableCell>
                  <TableCell>
                    <TextField
                      onChange={event => handleChange('kit_description', event.target.value)}
                      required
                      type="date"
                      size="small"
                      fullWidth
                    />
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell><b>Lead Time (In Weeks):</b></TableCell>
                  <TableCell>
                    CALC#
                    {/* <TextField
                      onChange={event => handleChange('kit_description', event.target.value)}
                      required
                      type="search"
                      size="small"
                    /> */}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell><b>Shipping Street Address:</b></TableCell>
                  <TableCell>
                    <TextField
                      onChange={event => handleChange('kit_description', event.target.value)}
                      required
                      type="search"
                      size="small"
                      fullWidth
                    />
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell><b>Shipping City:</b></TableCell>
                  <TableCell>
                    <TextField
                      onChange={event => handleChange('kit_description', event.target.value)}
                      required
                      type="search"
                      size="small"
                      fullWidth
                    />
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell><b>Shipping State/Province:</b></TableCell>
                  <TableCell>
                    <Select
                      onChange={event => handleChange('kit_description', event.target.value)}
                      required
                      size="small"
                      fullWidth
                      defaultValue="0"
                    >
                      {shippingCosts.map(state => {
                        return (<MenuItem value={state.id}>{state.ship_to_state_province}</MenuItem>)
                      }
                      )}
                      {/* <MenuItem value="0">Select</MenuItem> */}
                    </Select>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell><b>Shipping Zip/Postal Code:</b></TableCell>
                  <TableCell>
                    <TextField
                      onChange={event => handleChange('kit_description', event.target.value)}
                      required
                      type="number"
                      size="small"
                      fullWidth
                    />
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell><b>Shipping Country:</b></TableCell>
                  <TableCell>
                    <Select
                      onChange={event => handleChange('kit_description', event.target.value)}
                      required
                      size="small"
                      fullWidth
                      defaultValue="usa"
                    >
                      <MenuItem value="usa">United States</MenuItem>
                      <MenuItem value="canada">Canada</MenuItem>
                    </Select>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell></TableCell>
                  <TableCell align="right">
                    <Button
                      type="submit"
                      // onClick={event => handleSubmit(event)}
                      variant="contained"
                      style={{ fontFamily: 'Lexend Tera', fontSize: '11px' }}
                      color="primary"
                    >
                      Submit
                    </Button>
                  </TableCell>
                </TableRow>

              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        {/* End Grid Table #2 */}


        {/* Grid Table #3A (IMPERIAL): Display the Project Quantity Calc Form */}
        <Grid item xs={6}>
          <TableContainer component={Paper}>
            <h3 className="lexendFont">Project Quantity Calculations</h3>
            <Table size="small">
              <TableBody>
                <TableRow>
                  <TableCell><b>Square Feet</b></TableCell>
                  <TableCell>
                    <TextField
                      onChange={event => handleChange('kit_description', event.target.value)}
                      required
                      type="number"
                      size="small"
                      fullWidth
                      InputProps={{
                        startAdornment: <InputAdornment position="start">ft</InputAdornment>,
                      }}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><b>Thickness (Inches)</b></TableCell>
                  <TableCell>
                    <TextField
                      onChange={event => handleChange('kit_description', event.target.value)}
                      required
                      type="number"
                      size="small"
                      fullWidth
                      InputProps={{
                        startAdornment: <InputAdornment position="start">in</InputAdornment>,
                      }}
                    />
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell><b>Cubic Yards:</b></TableCell>
                  <TableCell>CALC#</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell><b>Thickening @ Perimeter (CY):</b></TableCell>
                  <TableCell>CALC#</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell><b>Thickening @ Construction Joints (CY):</b></TableCell>
                  <TableCell>CALC#</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell><b>Subtotal:</b></TableCell>
                  <TableCell>CALC#</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell><b>Waste Factor @ 5%:</b></TableCell>
                  <TableCell>CALC#</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell><b>Total Cubic Yards:</b></TableCell>
                  <TableCell>CALC#</TableCell>
                </TableRow>

              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        {/* End Grid Table #3A (IMPERIAL) */}


        {/* Grid Table #4A (IMPERIAL): Display the Thickened Edge Calc Form */}
        <Grid item xs={6}>
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
                  <TableCell><b>Lineal Feet:</b></TableCell>
                  <TableCell>
                    <TextField
                      onChange={event => handleChange('kit_description', event.target.value)}
                      required
                      type="number"
                      size="small"
                      InputProps={{
                        startAdornment: <InputAdornment position="start">ft</InputAdornment>,
                      }}
                      fullWidth
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      onChange={event => handleChange('kit_description', event.target.value)}
                      required
                      type="number"
                      size="small"
                      fullWidth
                      InputProps={{
                        startAdornment: <InputAdornment position="start">ft</InputAdornment>,
                      }}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><b>Width:</b></TableCell>
                  <TableCell>CALC#</TableCell>
                  <TableCell>CALC#</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><b>Additional Thickness (Inches):</b></TableCell>
                  <TableCell>CALC#</TableCell>
                  <TableCell>CALC#</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><b>Cubic Thickness (Inches):</b></TableCell>
                  <TableCell>CALC#</TableCell>
                  <TableCell>CALC#</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        {/* End Grid Table #4A (IMPERIAL) */}


        {/* Grid Table #5A (IMPERIAL): Display the Project Quantity Calc Form */}
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
                  <TableCell><b>PrīmX DC (lbs)</b></TableCell>
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
                  <TableCell><b>PrīmX Flow (ltrs)</b></TableCell>
                  <TableCell style={{ width: '1em' }}>
                    <TextField
                      onChange={event => handleChange('kit_description', event.target.value)}
                      required
                      type="number"
                      size="small"
                      fullWidth
                    />
                  </TableCell>
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
                  <TableCell><b>PrīmX Steel Fibers (lbs)</b></TableCell>
                  <TableCell style={{ width: '1em' }}>
                    <TextField
                      onChange={event => handleChange('kit_description', event.target.value)}
                      required
                      type="number"
                      size="small"
                      fullWidth
                    />
                  </TableCell>
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
                  <TableCell><b>PrīmX UltraCure Blankets (sq/f)</b></TableCell>
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
                  <TableCell><b>PrīmX CPEA (ltrs)</b></TableCell>
                  <TableCell style={{ width: '1em' }}>
                    <TextField
                      onChange={event => handleChange('kit_description', event.target.value)}
                      required
                      type="number"
                      size="small"
                      fullWidth
                    />
                  </TableCell>
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

              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        {/* End Grid Table #5A (IMPERIAL) */}

      </Grid>
    </div>
  )
}
