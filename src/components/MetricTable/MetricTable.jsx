//#region ⬇⬇ All document setup, below:
// ⬇ File Imports: 
// ⬇ Dependent Functionality:
import { useDispatch, useSelector } from 'react-redux';
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import useEstimateCalculations from '../../hooks/useEstimateCalculations';

import { Button, MenuItem, TextField, InputLabel, Select, Radio, RadioGroup, FormControl, FormLabel, FormControlLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid, InputAdornment } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import { useStyles } from '../MuiStyling/MuiStyling';
import LicenseeHomePage from '../LicenseeHomePage/LicenseeHomePage';

//#endregion ⬆⬆ All document setup above.


export default function MetricTable() {
  // //#region ⬇⬇ All state variables below:
  const dispatch = useDispatch();
  const history = useHistory();
  const classes = useStyles();
  const today = new Date().toISOString().substring(0, 10);
  const calculateEstimate = useEstimateCalculations;

  // const [newEstimate, setNewEstimate] = useState({
  //   measurement_units: 'imperial',
  //   country: 'United States',
  //   date_created: today,
  // });

  const companies = useSelector(store => store.companies);
  const shippingCosts = useSelector(store => store.shippingCosts);
  const floorTypes = useSelector(store => store.floorTypes);
  const placementTypes = useSelector(store => store.placementTypes);
  const estimateData = useSelector(store => store.estimatesReducer.estimatesReducer);
  const [calculatedDisplayObject, setCalculatedDisplayObject] = useState({});

  //   // ⬇ GET on page load:
  //   useEffect(() => {
  //     // Licensee/Company Name Call
  //     dispatch({ type: 'FETCH_COMPANIES' }),
  //       // State/Province Call
  //       dispatch({ type: 'FETCH_SHIPPING_COSTS' }),
  //       // Floor Type Call
  //       dispatch({ type: 'FETCH_FLOOR_TYPES' }),
  //       // Placement Type Call
  //       dispatch({ type: 'FETCH_PLACEMENT_TYPES' })
  //   }, []);
  //   //#endregion ⬆⬆ All state variables above. 

  // have a useEffect looking at the estimateData object. If all necessary keys exist indicating user has entered all necessary form data,
  // run the estimate calculations functions to display the rest of the table. This also makes the materials table adjust automatically if the user changes
  // values
  useEffect(() => {
    if (estimateData.square_meters && estimateData.thickness_millimeters && estimateData.thickened_edge_construction_joint_lineal_meters &&
        estimateData.thickened_edge_perimeter_lineal_meters && estimateData.primx_flow_dosage_liters && estimateData.primx_steel_fibers_dosage_kgs &&
        estimateData.primx_cpea_dosage_liters) {
          // once all the keys exist, run the calculate estimate function and set the table display state for the calculated values
          const calculatedObject = calculateEstimate(estimateData)
          setCalculatedDisplayObject(calculatedObject)
      }
  }, [estimateData])

  //#region ⬇⬇ Event handlers below:
  /** ⬇ handleChange:
   * When the user types, this will set their input to the kit object with keys for each field. 
   */
  const handleChange = (key, value) => {
    console.log('In handleChange, key/value:', key, '/', value);
    // setNewEstimate({ ...newEstimate, [key]: value });

    dispatch({
      type: 'SET_ESTIMATE',
      payload: { key: key, value: value }
    });
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

  /** ⬇ handleSubmit:
 * When clicked, this will post the object to the DB and send the user back to the dashboard. 
 */
  const handleSave = event => {
    console.log('In Metric handleSave');
    // attach history from useHistory to the estimate object to allow navigation from inside the saga
    estimateData.history = history;

    // ⬇ Don't refresh until submit:
    event.preventDefault();
    // send the estimate object to be POSTed
    dispatch({type: 'ADD_ESTIMATE', payload: estimateData})
  } // End handleSave


  const handleCalculateCosts = () => {
    console.log('In Metric handleCalculateCosts, estimateData:', estimateData);
    const calculatedObject = calculateEstimate(estimateData)
    setCalculatedDisplayObject(calculatedObject)
    console.log('***CALCULATED OBJECT****', calculatedObject);
    // console.log('DISPLAY OBJECT', calculatedDisplayObject);
    // dispatch({type: 'FETCH_ESTIMATE', payload: calculatedObject});
  }
  //#endregion ⬆⬆ Event handles above. 


  return (
    <>
      <form onSubmit={handleSave}>
        <Grid container
          spacing={2}
          justifyContent="center"
        >
          <Grid item xs={6}>
            <Paper elevation={3}>
              <TableContainer>
                <h3 className="lexendFont">Project Quantity Calculations</h3>
                <Table size="small">
                  <TableBody>

                    <TableRow>
                      <TableCell><b>Square Meters:</b></TableCell>
                      <TableCell>
                        <TextField
                          onChange={event => handleChange('square_meters', event.target.value)}
                          required
                          type="number"
                          size="small"
                          fullWidth
                          InputProps={{
                            startAdornment: <InputAdornment position="start">m²</InputAdornment>,
                          }}
                        />
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell><b>Thickness (mm):</b></TableCell>
                      <TableCell>
                        <TextField
                          onChange={event => handleChange('thickness_millimeters', event.target.value)}
                          required
                          type="number"
                          size="small"
                          fullWidth
                          InputProps={{
                            startAdornment: <InputAdornment position="start">mm</InputAdornment>,
                          }}
                        />
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell><b>Cubic Meters:</b></TableCell>
                      <TableCell>
                        {calculatedDisplayObject?.cubic_meters}
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell><b>Thickening @ Perimeter (m³):</b></TableCell>
                      <TableCell>
                        {calculatedDisplayObject?.perimeter_thickening_cubic_meters}
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell><b>Thickening @ Construction Joints (m³):</b></TableCell>
                      <TableCell>
                        {calculatedDisplayObject?.construction_joint_thickening_cubic_meters}
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell><b>Subtotal:</b></TableCell>
                      <TableCell>
                        {calculatedDisplayObject?.cubic_meters_subtotal}
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell><b>Waste Factor @ 5%:</b></TableCell>
                      <TableCell>{calculatedDisplayObject?.waste_factor_cubic_meters}</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell><b>Total Cubic Meters:</b></TableCell>
                      <TableCell>{calculatedDisplayObject?.design_cubic_meters_total}</TableCell>
                    </TableRow>

                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>

          <Grid item xs={6}>
            <Paper elevation={3}>
              <TableContainer>
                <h3 className="lexendFont">Thickened Edge Calculator</h3>
                <p>If applicable, for slabs under 150mm.<br />Note: For 'Slab on Insulation', enter "0" for both.</p>
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
                      <TableCell><b>Lineal Meters:</b></TableCell>
                      <TableCell>
                        <TextField
                          onChange={event => handleChange('thickened_edge_perimeter_lineal_meters', event.target.value)}
                          required
                          type="number"
                          size="small"
                          InputProps={{
                            startAdornment: <InputAdornment position="start">m</InputAdornment>,
                          }}
                          fullWidth
                        // defaultValue="0"
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          onChange={event => handleChange('thickened_edge_construction_joint_lineal_meters', event.target.value)}
                          required
                          type="number"
                          size="small"
                          fullWidth
                          InputProps={{
                            startAdornment: <InputAdornment position="start">m</InputAdornment>,
                          }}
                        // defaultValue="0"
                        />
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell><b>Width (m³):</b></TableCell>
                      <TableCell>1.5</TableCell>
                      <TableCell>3.0</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell><b>Additional Thickness (mm):</b></TableCell>
                      <TableCell>{calculatedDisplayObject?.additional_thickness_millimeters}</TableCell>
                      <TableCell>{calculatedDisplayObject?.additional_thickness_millimeters}</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell><b>Cubic Meters:</b></TableCell>
                      <TableCell>{calculatedDisplayObject?.perimeter_thickening_cubic_meters}</TableCell>
                      <TableCell>{calculatedDisplayObject?.construction_joint_thickening_cubic_meters}</TableCell>
                    </TableRow>

                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper elevation={3}>
              <TableContainer>
                <h3 className="lexendFont">Materials Table</h3>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell></TableCell>
                      <TableCell><b>Dosage<br />Rate<br />(per m³)</b></TableCell>
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
                      <TableCell><b>PrīmX DC (kgs)</b></TableCell>
                      <TableCell>40</TableCell>
                      <TableCell>{calculatedDisplayObject?.primx_dc_total_amount_needed}</TableCell>
                      <TableCell>1250</TableCell>
                      <TableCell>{calculatedDisplayObject?.primx_dc_packages_needed}</TableCell>
                      <TableCell>{calculatedDisplayObject?.primx_dc_total_order_quantity}</TableCell>
                      <TableCell>${calculatedDisplayObject?.primx_dc_unit_price}</TableCell>
                      <TableCell>${calculatedDisplayObject?.primx_dc_total_materials_price}</TableCell>
                      <TableCell>{calculatedDisplayObject?.primx_dc_containers_needed}</TableCell>
                      <TableCell>${calculatedDisplayObject?.primx_dc_calculated_shipping_estimate}</TableCell>
                      <TableCell>${calculatedDisplayObject?.primx_dc_total_cost_estimate}</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell><b>PrīmX Flow (ltrs)</b></TableCell>
                      <TableCell style={{ width: '1em' }}>
                        <TextField
                          onChange={event => handleChange('primx_flow_dosage_liters', event.target.value)}
                          required
                          type="number"
                          size="small"
                          fullWidth
                        />
                      </TableCell>
                      <TableCell>{calculatedDisplayObject?.primx_flow_total_amount_needed}</TableCell>
                      <TableCell>1000</TableCell>
                      <TableCell>{calculatedDisplayObject?.primx_flow_packages_needed}</TableCell>
                      <TableCell>{calculatedDisplayObject?.primx_flow_total_order_quantity}</TableCell>
                      <TableCell>${calculatedDisplayObject?.primx_flow_unit_price}</TableCell>
                      <TableCell>${calculatedDisplayObject?.primx_flow_total_materials_price}</TableCell>
                      <TableCell>{calculatedDisplayObject?.primx_flow_containers_needed}</TableCell>
                      <TableCell>${calculatedDisplayObject?.primx_flow_calculated_shipping_estimate}</TableCell>
                      <TableCell>${calculatedDisplayObject?.primx_flow_total_cost_estimate}</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell><b>PrīmX Steel Fibers (kgs)</b></TableCell>
                      <TableCell style={{ width: '1em' }}>
                        <TextField
                          onChange={event => handleChange('primx_steel_fibers_dosage_kgs', event.target.value)}
                          required
                          type="number"
                          size="small"
                          fullWidth
                        />
                      </TableCell>
                      <TableCell>{calculatedDisplayObject?.primx_steel_fibers_total_amount_needed}</TableCell>
                      <TableCell>19200</TableCell>
                      <TableCell>{calculatedDisplayObject?.primx_steel_fibers_packages_needed}</TableCell>
                      <TableCell>{calculatedDisplayObject?.primx_steel_fibers_total_order_quantity}</TableCell>
                      <TableCell>${calculatedDisplayObject?.primx_steel_fibers_unit_price}</TableCell>
                      <TableCell>${calculatedDisplayObject?.primx_steel_fibers_total_materials_price}</TableCell>
                      <TableCell>{calculatedDisplayObject?.primx_steel_fibers_containers_needed}</TableCell>
                      <TableCell>${calculatedDisplayObject?.primx_steel_fibers_calculated_shipping_estimate}</TableCell>
                      <TableCell>${calculatedDisplayObject?.primx_steel_fibers_total_cost_estimate}</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell><b>PrīmX UltraCure Blankets (m²)</b></TableCell>
                      <TableCell>N/A</TableCell>
                      <TableCell>{calculatedDisplayObject?.primx_ultracure_blankets_total_amount_needed}</TableCell>
                      <TableCell>600</TableCell>
                      <TableCell>{calculatedDisplayObject?.primx_ultracure_blankets_packages_needed}</TableCell>
                      <TableCell>{calculatedDisplayObject?.primx_ultracure_blankets_total_order_quantity}</TableCell>
                      <TableCell>${calculatedDisplayObject?.primx_ultracure_blankets_unit_price}</TableCell>
                      <TableCell>${calculatedDisplayObject?.primx_ultracure_blankets_total_materials_price}</TableCell>
                      <TableCell>0</TableCell>
                      <TableCell>0</TableCell>
                      <TableCell>${calculatedDisplayObject?.primx_ultracure_blankets_total_cost_estimate}</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell><b>PrīmX CPEA (ltrs)</b></TableCell>
                      <TableCell style={{ width: '1em' }}>
                        <TextField
                          onChange={event => handleChange('primx_cpea_dosage_liters', event.target.value)}
                          required
                          type="number"
                          size="small"
                          fullWidth
                        />
                      </TableCell>
                      <TableCell>{calculatedDisplayObject?.primx_cpea_total_amount_needed}</TableCell>
                      <TableCell>1000</TableCell>
                      <TableCell>{calculatedDisplayObject?.primx_cpea_packages_needed}</TableCell>
                      <TableCell>{calculatedDisplayObject?.primx_cpea_total_order_quantity}</TableCell>
                      <TableCell>${calculatedDisplayObject?.primx_cpea_unit_price}</TableCell>
                      <TableCell>${calculatedDisplayObject?.primx_cpea_total_materials_price}</TableCell>
                      <TableCell>{calculatedDisplayObject?.primx_cpea_containers_needed}</TableCell>
                      <TableCell>${calculatedDisplayObject?.primx_cpea_calculated_shipping_estimate}</TableCell>
                      <TableCell>${calculatedDisplayObject?.primx_cpea_total_cost_estimate}</TableCell>
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
                      <TableCell>${calculatedDisplayObject?.design_total_materials_price}</TableCell>
                      <TableCell>
                        {/* Total number of containers go into this cell */}
                        {calculatedDisplayObject?.design_total_containers}
                      </TableCell>
                      <TableCell>${calculatedDisplayObject?.design_total_shipping_estimate}</TableCell>
                      <TableCell>${calculatedDisplayObject?.design_total_price_estimate}</TableCell>
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
                        <Button
                          // type="submit"
                          onClick={event => handleCalculateCosts(event)}
                          variant="contained"
                          className={classes.LexendTeraFont11}
                          color="primary"
                        >
                          Calculate Costs
                        </Button>
                        &nbsp; &nbsp; 
                        <Button
                          type="submit"
                          // ⬇⬇⬇⬇ COMMENT THIS CODE IN/OUT FOR FORM VALIDATION:
                          // onClick={event => handleSave(event)}
                          variant="contained"
                          className={classes.LexendTeraFont11}
                          color="secondary"
                        >
                          Save Estimate
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
    </>
  )
}
