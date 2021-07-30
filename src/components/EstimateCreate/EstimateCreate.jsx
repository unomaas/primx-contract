//#region ⬇⬇ All document setup, below:
// ⬇ File Imports: 

import './EstimateCreate.css';
// ⬇ Dependent Functionality:
import { useDispatch, useSelector } from 'react-redux';
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, MenuItem, TextField, InputLabel, Select, Radio, RadioGroup, FormControl, FormLabel, FormControlLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid, InputAdornment, FormHelperText } from '@material-ui/core';
import { ToggleButtonGroup, ToggleButton } from '@material-ui/lab';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import { useStyles } from '../MuiStyling/MuiStyling';
import LicenseeHomePage from '../LicenseeHomePage/LicenseeHomePage';
import ImperialTable from '../ImperialTable/ImperialTable';
import MetricTable from '../MetricTable/MetricTable';
import { eventNames } from 'commander';
import ButtonToggle from '../ButtonToggle/ButtonToggle';
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
  const estimateData = useSelector(store => store.estimatesReducer.estimatesReducer);
  const productsReducer = useSelector(store => store.products);
  const showTables = useSelector(store => store.estimatesReducer.tableState);
  const [error, setError] = useState(false);
  const [radioError, setRadioError] = useState("");
  const {leadtime, setLeadTime} = useState("");

  // ⬇ GET on page load:
  useEffect(() => {
    // Licensee/Company Name Call
    dispatch({ type: 'FETCH_COMPANIES' }),
      // State/Province Call
      dispatch({ type: 'FETCH_SHIPPING_COSTS' }),
      // Floor Type Call
      dispatch({ type: 'FETCH_FLOOR_TYPES' }),
      // Placement Type Call
      dispatch({ type: 'FETCH_PLACEMENT_TYPES' }),
      // Products Call
      dispatch({ type: 'FETCH_PRODUCTS' })
  }, []);
  //#endregion ⬆⬆ All state variables above. 


  //#region ⬇⬇ Event handlers below:

  const timeDifference = (date2, date) => {
    let diff = (date2.getTime() - date1.getTime()) / 1000;
    diff /= (60 * 60 * 24 * 7);
    return Math.abs(Math.round(diff));
  }

  /** ⬇ handleChange:
    * When the user types, this will set their input to the kit object with keys for each field. 
    */
  const handleChange = (key, value) => {
    console.log('In EstimateCreate handleChange, key/value:', key, '/', value);
    if (key == "anticipated_first_pour_date") {
      // console.log('*** Time diff is:', timeDifference(value - today))
    }

    // ⬇ Sends the keys/values to the estimate reducer object: 
    dispatch({
      type: 'SET_ESTIMATE',
      payload: { key: key, value: value }
    });
  } // End handleChange

  // ⬇ Change handler for the Shipping State/Province dropdown: gets passed the id of the ship to state
  const handleShipping = (id) => {
    // ⬇ Sends the keys/values to the estimate reducer object: 
    dispatch({
      type: 'SET_ESTIMATE',
      payload: { key: 'shipping_costs_id', value: id }
    });

    // ⬇ Add in state shipping costs based off of state id in object:
    shippingCosts.forEach(shippingState => {
      if (shippingState.id == id) {
        console.log('Shipping Data:', shippingState);
        // ⬇ Loop over shippingState object and add all values to the estimate object in the estimateReducer
        for (let keyName in shippingState) {
          dispatch({
            type: 'SET_ESTIMATE',
            payload: {
              key: keyName,
              value: shippingState[keyName]
            } // End payload.
          }) // End dispatch.
        }; // End for loop.
      } // End if statement
    }) // end shippingCosts forEach
  } // End handleShipping

  const handleMeasurementUnits = (units) => {
    console.log('In handleMeasurementUnits, units:', units);
    // ⬇ Making sure validation doesn't trigger:
    setError(false);
    setRadioError("");
    // ⬇ The logic for finding product costs needs to be hard coded to look at database values, since we need to save a snapshot of the pricing at the time of estimate creation:
    const pricingArray = [
      { key: 'primx_flow_unit_price', value: productsReducer[2].product_price },
      { key: 'primx_cpea_unit_price', value: productsReducer[7].product_price },
    ]
    if (units == 'imperial') {
      pricingArray.push(
        { key: 'primx_dc_unit_price', value: productsReducer[0].product_price },
        { key: 'primx_steel_fibers_unit_price', value: productsReducer[3].product_price },
        { key: 'primx_ultracure_blankets_unit_price', value: productsReducer[5].product_price }
      )
    } else if (units == 'metric') {
      pricingArray.push(
        { key: 'primx_dc_unit_price', value: productsReducer[1].product_price },
        { key: 'primx_steel_fibers_unit_price', value: productsReducer[4].product_price },
        { key: 'primx_ultracure_blankets_unit_price', value: productsReducer[6].product_price }
      )
    } // End if/else statement. 
    // ⬇ Loop through pricingArray to dispatch values to be stored in the estimates reducer:
    pricingArray.forEach(product => {
      dispatch({
        type: 'SET_ESTIMATE',
        payload: { key: product.key, value: product.value }
      });
    })
    // set units in the estimate reducer
    dispatch({
      type: 'SET_ESTIMATE',
      payload: { key: 'measurement_units', value: units }
    });

  } // End handleMeasurementUnits

  /** ⬇ handleSubmit:
    * When clicked, this will post the object to the DB and send the user back to the dashboard. 
    */
  const handleSubmit = (event) => {
    console.log('In handleSubmit');
    //  Don't refresh until submit:
    event.preventDefault();
    // ⬇ Radio button validation:
    if (!estimateData.measurement_units) {
      setError(true);
      setRadioError("Please select a value.");
    } else (
      dispatch({
        type: 'SET_TABLE_STATE',
        payload: true
      })
    )
    // // ⬇ Sending newPlant to our reducer: 
    // dispatch({ type: 'ADD_NEW_KIT', payload: newKit });
    // // ⬇ Send the user back:
    // history.push('/dashboard');
  } // End handleSubmit

  /** ⬇ handleSubmit:
    * When clicked, this will post the object to the DB and send the user back to the dashboard. 
    */
  const handleSave = event => {
    console.log('In handleSave');
    // ⬇ Don't refresh until submit:
    event.preventDefault();
    // // ⬇ Sending newPlant to our reducer: 
    // dispatch({ type: 'ADD_NEW_KIT', payload: newKit });
    // // ⬇ Send the user back:
    // history.push('/dashboard');
  } // End handleSubmit



  //#endregion ⬆⬆ Event handles above. 


  console.log('estimateData is currently:', estimateData);
  return (
    <div className="EstimateCreate-wrapper">

      <ButtonToggle />

      <br />

      <form onSubmit={handleSubmit}>

        <Grid container
          spacing={2}
          justify="center"
        >

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
                        <TextField
                          onChange={event => handleChange('project_name', event.target.value)}
                          required
                          type="search"
                          size="small"
                          fullWidth
                        />
                      </TableCell>
                    </TableRow>

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
                          <MenuItem value="0">Please Select</MenuItem>
                          {companies.map(companies => {
                            return (<MenuItem value={companies.id}>{companies.licensee_contractor_name}</MenuItem>)
                          }
                          )}
                        </Select>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell><b>Project General Contractor:</b></TableCell>
                      <TableCell>
                        <TextField
                          onChange={event => handleChange('project_general_contractor', event.target.value)}
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
                          onChange={event => handleChange('project_manager_email', event.target.value)}
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
                          onChange={event => handleChange('project_manager_phone', event.target.value)}
                          required
                          type="number"
                          size="small"
                          fullWidth
                        />
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell><b>Your Purchase Order #:</b></TableCell>
                      <TableCell>
                        <TextField
                          onChange={event => handleChange('po_number', event.target.value)}
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
                        </Select>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell><b>Placement Type:</b></TableCell>
                      <TableCell>
                        <Select
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
                        </Select>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell><b>Unit of Measurement:</b></TableCell>
                      <TableCell>
                        <FormControl error={error}>
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
                        </FormControl>
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
                        <TextField
                          // ⬇ Won't work with value=today. 
                          // onChange={event => handleChange('date_created', event.target.value)} 
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
                          onChange={event => handleChange('anticipated_first_pour_date', event.target.value)}
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
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell><b>Shipping Street Address:</b></TableCell>
                      <TableCell>
                        <TextField
                          onChange={event => handleChange('ship_to_address', event.target.value)}
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
                          onChange={event => handleChange('ship_to_city', event.target.value)}
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
                        </Select>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell><b>Shipping Zip/Postal Code:</b></TableCell>
                      <TableCell>
                        <TextField
                          onChange={event => handleChange('zip_postal_code', event.target.value)}
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
                          onChange={event => handleChange('country', event.target.value)}
                          required
                          size="small"
                          fullWidth
                          defaultValue="0"
                        >
                          <MenuItem value="0">Please Select</MenuItem>
                          <MenuItem value="United States">United States</MenuItem>
                          <MenuItem value="Canada">Canada</MenuItem>
                        </Select>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell colspan={2} align="right">
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
                    </TableRow>

                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
          {/* End Grid Table #2 */}

        </Grid>
      </form>

      <br />

      {/* Conditional rendering to show or hide tables based off submit button: */}
      {showTables ? (
        <>
          {/* Conditional rendering to show Imperial or Metric Table: */}
          {estimateData.measurement_units == "imperial" ? (
            // If they select Imperial, show Imperial Table: 
            <ImperialTable />
          ) : (
            // If they select Metric, show Metric Table: 
            <MetricTable />
          )}
        </>
      ) : (<></>)}
      {/* End conditional rendering. */}

    </div >
  )
}
