import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import useEstimateCalculations from '../../hooks/useEstimateCalculations';

import { Button, MenuItem, TextField, InputLabel, Select, Radio, RadioGroup, FormControl, FormLabel, FormControlLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid, InputAdornment, FormHelperText, Box } from '@material-ui/core';
import { useParams } from 'react-router';
import { useStyles } from '../MuiStyling/MuiStyling';


import LicenseeHomePage from '../LicenseeHomePage/LicenseeHomePage';
import ButtonToggle from '../ButtonToggle/ButtonToggle';

export default function EstimateLookup() {
  const companies = useSelector(store => store.companies);
  const calculateEstimate = useEstimateCalculations;
 
  // searchResult below is an estimate object searched from the DB that has already been mutated by the useEstimateCalculations function
  const searchResult = useSelector(store => store.estimatesReducer.searchedEstimate);
  const [searchQuery, setSearchQuery] = useState({
    licensee_id: "0",
    id: ""
  });
  const [error, setError] = useState(false);
  const classes = useStyles();
  const [selectError, setSelectError] = useState("");

  // component has a main view at /lookup and a sub-view of /lookup/... where ... is the licensee ID appended with the estimate number
  // const { licensee_id_estimate_number } = useParams();
  const {estimate_number_searched, licensee_id_searched} = useParams();

  const dispatch = useDispatch();
  const history = useHistory();
  
  useEffect(() => {
    // Make the toggle button show this selection:
    dispatch({ type: 'SET_BUTTON_STATE', payload: 'lookup' }),
      dispatch({ type: 'FETCH_COMPANIES' })
  }, []);

  useEffect(() => {
    // if the user got here with params, either by searching from the lookup view or by clicking a link in the admin table view,
    // dispatch the data in the url params to run a GET request to the DB
    if(estimate_number_searched && licensee_id_searched) {

      dispatch({type: 'FETCH_ESTIMATE_QUERY', payload: {
        licensee_id: licensee_id_searched,
        estimate_number: estimate_number_searched
      }})
    }
  }, [estimate_number_searched])

  const handleChange = (key, value) => {
    console.log('In handleChange, key/value:', key, '/', value);
    setSearchQuery({ ...searchQuery, [key]: value })
  };

  const handleSubmit = () => {
    console.log('In handleSubmit')
    // ⬇ Select dropdown validation:
 
    
      
  
    if (searchQuery.licensee_id !== "0") {
      // If they selected a company name from dropdown:
      console.log("Submitting.");
      // use history to send user to the details subview of their search query
      history.push(`/lookup/${searchQuery.licensee_id}/${searchQuery.estimate_number}`)
    } else {
      // If they haven't, pop up warning and prevent them:
      console.log(("Not submitting."));
      setError(true);
      setSelectError("Please select a value.");
    }
  };

  console.log('search estimate:', searchResult)

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
                        <FormControl error={error}>
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
                          <FormHelperText>{selectError}</FormHelperText>
                        </FormControl>
                      </TableCell>

                      <TableCell><b>Estimate Number:</b></TableCell>
                      <TableCell>
                        <TextField
                          onChange={event => handleChange('estimate_number', event.target.value)}
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
      <br />

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
                      {searchResult?.project_name}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Licensee/Contractor Name:</b></TableCell>
                    <TableCell>
                      NEED TO PULL NAME IN USING LICENSEE TABLE HERE
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Project General Contractor:</b></TableCell>
                    <TableCell>
                      {searchResult?.project_general_contractor}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Project Manager Name:</b></TableCell>
                    <TableCell>
                      {searchResult?.project_manager_name}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Project Manager Email:</b></TableCell>
                    <TableCell>
                      {searchResult?.project_manager_email}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Project Manager Cell:</b></TableCell>
                    <TableCell>
                      {searchResult?.project_manager_phone}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Floor Type:</b></TableCell>
                    <TableCell>
                      NEED TO GET FLOOR TYPE NAME FROM DB
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Placement Type:</b></TableCell>
                    <TableCell>
                      NEED TO GET PLACEMENT TYPE NAME FROM DB
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Unit of Measurement:</b></TableCell>
                    <TableCell>
                      {searchResult?.measurement_units}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Today's Date: Should be Date created?</b></TableCell>
                    <TableCell>
                      {searchResult?.date_created}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Anticipated First Pour Date:</b></TableCell>
                    <TableCell>
                      {searchResult?.anticipated_first_pour_date}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Lead Time (In Weeks):</b></TableCell>
                    <TableCell>
                      BRING IN CALCULATE FUNCTION SOMEHOW
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Shipping Street Address:</b></TableCell>
                    <TableCell>
                      {searchResult?.ship_to_address}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Shipping City:</b></TableCell>
                    <TableCell>
                      {searchResult?.ship_to_city}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Shipping State/Province:</b></TableCell>
                    <TableCell>
                      NEED TO GET SHIPPING STATE/PROVINCE WITH DATA
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Shipping Zip/Postal Code:</b></TableCell>
                    <TableCell>
                      {searchResult?.zip_postal_code}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Shipping Country:</b></TableCell>
                    <TableCell>
                      {searchResult?.country}
                    </TableCell>
                  </TableRow>

                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>





        {/* Table #2 Imperial: */}

        {/* <Grid item xs={6}>
          <Paper elevation={3}>
            <TableContainer>
              <h3>Project Quantity Calculations</h3>
              <Table size="small">
                <TableBody>

                  <TableRow>
                    <TableCell><b>Square Feet:</b></TableCell>
                    <TableCell>
                      {searchResult?.square_feet}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Thickness (in):</b></TableCell>
                    <TableCell>
                      {searchResult?.thickness_inches}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Cubic Yards:</b></TableCell>
                    <TableCell>
                      {searchResult?.cubic_yards}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Thickening @ Perimeter (yd³):</b></TableCell>
                    <TableCell>
                      {searchResult?.perimeter_thickening_cubic_yards}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Thickening @ Construction Joints (yd³):</b></TableCell>
                    <TableCell>
                      {searchResult?.construction_joint_thickening_cubic_yards}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Subtotal:</b></TableCell>
                    <TableCell>
                      {searchResult?.cubic_yards_subtotal}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Waste Factor @ 5%:</b></TableCell>
                    <TableCell>
                      {searchResult?.waste_factor_cubic_yards}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Total Cubic Yards:</b></TableCell>
                    <TableCell>
                      {searchResult?.design_cubic_yards_total}
                    </TableCell>
                  </TableRow>

                </TableBody>
              </Table>

              <h3>Thickened Edge Calculator</h3>
              <p>If applicable, for slabs under 6in.</p>
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
                      {searchResult?.thickened_edge_perimeter_lineal_feet}
                    </TableCell>
                    <TableCell>
                      {searchResult?.thickened_edge_construction_joint_lineal_feet}
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
                      {searchResult?.additional_thickness_inches}
                    </TableCell>
                    <TableCell>
                      {searchResult?.additional_thickness_inches}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Cubic Yards:</b></TableCell>
                    <TableCell>
                      {searchResult?.perimeter_thickening_cubic_yards}
                    </TableCell>
                    <TableCell>
                      {searchResult?.construction_joint_thickening_cubic_yards}
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
                    <TableCell><b>PrīmX DC (lbs)</b></TableCell>
                    <TableCell><b>PrīmX Flow (ltrs)</b></TableCell>
                    <TableCell><b>PrīmX Steel Fibers (lbs)</b></TableCell>
                    <TableCell><b>PrīmX UltraCure Blankets (ft²)</b></TableCell>
                    <TableCell><b>PrīmX CPEA (ltrs)</b></TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  <TableRow>
                    <TableCell><b>Dosage Rate (per yd³):</b></TableCell>
                    <TableCell>67</TableCell>
                    <TableCell>{searchResult?.primx_flow_dosage_liters}</TableCell>
                    <TableCell>{searchResult?.primx_steel_fibers_dosage_lbs}</TableCell>
                    <TableCell>N/A</TableCell>
                    <TableCell>{searchResult?.primx_cpea_dosage_liters}</TableCell>
                    <TableCell></TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Total Amount:</b></TableCell>
                    <TableCell>{searchResult?.primx_dc_total_amount_needed}</TableCell>
                    <TableCell>{searchResult?.primx_flow_total_amount_needed}</TableCell>
                    <TableCell>{searchResult?.primx_steel_fibers_total_amount_needed}</TableCell>
                    <TableCell>{searchResult?.primx_ultracure_blankets_total_amount_needed}</TableCell>
                    <TableCell>{searchResult?.primx_cpea_total_amount_needed}</TableCell>
                    <TableCell></TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Packaging Capacity:</b></TableCell>
                    <TableCell>2756</TableCell>
                    <TableCell>1000</TableCell>
                    <TableCell>42329</TableCell>
                    <TableCell>6458</TableCell>
                    <TableCell>1000</TableCell>
                    <TableCell></TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Packages Needed:</b></TableCell>
                    <TableCell>{searchResult?.primx_dc_packages_needed}</TableCell>
                    <TableCell>{searchResult?.primx_flow_packages_needed}</TableCell>
                    <TableCell>{searchResult?.primx_steel_fibers_packages_needed}</TableCell>
                    <TableCell>{searchResult?.primx_ultracure_blankets_packages_needed}</TableCell>
                    <TableCell>{searchResult?.primx_cpea_packages_needed}</TableCell>
                    <TableCell></TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Total Order Quantity:</b></TableCell>
                    <TableCell>{searchResult?.primx_dc_total_order_quantity}</TableCell>
                    <TableCell>{searchResult?.primx_flow_total_order_quantity}</TableCell>
                    <TableCell>{searchResult?.primx_steel_fibers_total_order_quantity}</TableCell>
                    <TableCell>{searchResult?.primx_ultracure_blankets_total_order_quantity}</TableCell>
                    <TableCell>{searchResult?.primx_cpea_total_order_quantity}</TableCell>
                    <TableCell></TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Materials Price:</b></TableCell>
                    <TableCell>{searchResult?.primx_dc_unit_price}</TableCell>
                    <TableCell>{searchResult?.primx_flow_unit_price}</TableCell>
                    <TableCell>{searchResult?.primx_steel_fibers_unit_price}</TableCell>
                    <TableCell>{searchResult?.primx_ultracure_blankets_unit_price}</TableCell>
                    <TableCell>{searchResult?.primx_cpea_unit_price}</TableCell>
                    <TableCell><b>Totals:</b></TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Total Materials Price:</b></TableCell>
                    <TableCell>{searchResult?.primx_dc_total_materials_price}</TableCell>
                    <TableCell>{searchResult?.primx_flow_total_materials_price}</TableCell>
                    <TableCell>{searchResult?.primx_steel_fibers_total_materials_price}</TableCell>
                    <TableCell>{searchResult?.primx_ultracure_blankets_total_materials_price}</TableCell>
                    <TableCell>{searchResult?.primx_cpea_total_materials_price}</TableCell>
                    <TableCell>{searchResult?.design_total_materials_price}</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Containers:</b></TableCell>
                    <TableCell>{searchResult?.primx_dc_containers_needed}</TableCell>
                    <TableCell>{searchResult?.primx_flow_containers_needed}</TableCell>
                    <TableCell>{searchResult?.primx_steel_fibers_containers_needed}</TableCell>
                    <TableCell>0</TableCell>
                    <TableCell>{searchResult?.primx_cpea_containers_needed}</TableCell>
                    <TableCell>{searchResult?.design_total_containers}</TableCell>

                  </TableRow>

                  <TableRow>
                    <TableCell><b>Shipping Estimate:</b></TableCell>
                    <TableCell>{searchResult?.primx_dc_calculated_shipping_estimate}</TableCell>
                    <TableCell>{searchResult?.primx_flow_calculated_shipping_estimate}</TableCell>
                    <TableCell>{searchResult?.primx_steel_fibers_calculated_shipping_estimate}</TableCell>
                    <TableCell>0</TableCell>
                    <TableCell>{searchResult?.primx_cpea_calculated_shipping_estimate}</TableCell>
                    <TableCell>{searchResult?.design_total_shipping_estimate}</TableCell>

                  </TableRow>

                  <TableRow>
                    <TableCell><b>Total Cost:</b></TableCell>
                    <TableCell><b>{searchResult?.primx_dc_total_cost_estimate}</b></TableCell>
                    <TableCell><b>{searchResult?.primx_flow_total_cost_estimate}</b></TableCell>
                    <TableCell><b>{searchResult?.primx_steel_fibers_total_cost_estimate}</b></TableCell>
                    <TableCell><b>{searchResult?.primx_ultracure_blankets_total_cost_estimate}</b></TableCell>
                    <TableCell><b>{searchResult?.primx_cpea_total_cost_estimate}</b></TableCell>
                    <TableCell><b>{searchResult?.design_total_price_estimate}</b></TableCell>
                  </TableRow> */}
        {/* End Imperial Tables */}



        {/* Table #3: Metric */}
        <Grid item xs={6}>
          <Paper elevation={3}>
            <TableContainer>
              <h3>Project Quantity Calculations</h3>
              <Table size="small">
                <TableBody>

                  <TableRow>
                    <TableCell><b>Square Meters:</b></TableCell>
                    <TableCell>
                      {searchResult?.square_meters}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Thickness (mm):</b></TableCell>
                    <TableCell>
                      {searchResult?.thickness_millimeters}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Cubic Meters:</b></TableCell>
                    <TableCell>
                      {searchResult?.cubic_meters}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Thickening @ Perimeter (m³):</b></TableCell>
                    <TableCell>
                      {searchResult?.perimeter_thickening_cubic_meters}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Thickening @ Construction Joints (m³):</b></TableCell>
                    <TableCell>
                      {searchResult?.construction_joint_thickening_cubic_meters}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Subtotal:</b></TableCell>
                    <TableCell>
                      {searchResult?.cubic_meters_subtotal}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Waste Factor @ 5%:</b></TableCell>
                    <TableCell>
                      {searchResult?.waste_factor_cubic_meters}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Total Cubic Meters:</b></TableCell>
                    <TableCell>
                      {searchResult?.design_cubic_meters_total}
                    </TableCell>
                  </TableRow>

                </TableBody>
              </Table>

              <h3>Thickened Edge Calculator</h3>
              <p>If applicable, for slabs under 150mm.</p>
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
                      {searchResult?.thickened_edge_perimeter_lineal_meters}
                    </TableCell>
                    <TableCell>
                      {searchResult?.thickened_edge_construction_joint_lineal_meters}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Width (m³):</b></TableCell>
                    <TableCell>
                      1.5
                    </TableCell>
                    <TableCell>
                      3.0
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Additional Thickness (mm):</b></TableCell>
                    <TableCell>
                      {searchResult?.additional_thickness_millimeters}
                    </TableCell>
                    <TableCell>
                      {searchResult?.additional_thickness_millimeters}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Cubic Meters:</b></TableCell>
                    <TableCell>
                      {searchResult?.perimeter_thickening_cubic_meters}
                    </TableCell>
                    <TableCell>
                      {searchResult?.construction_joint_thickening_cubic_meters}
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
                    <TableCell><b>PrīmX DC (kgs)</b></TableCell>
                    <TableCell><b>PrīmX Flow (ltrs)</b></TableCell>
                    <TableCell><b>PrīmX Steel Fibers (kgs)</b></TableCell>
                    <TableCell><b>PrīmX UltraCure Blankets (m²)</b></TableCell>
                    <TableCell><b>PrīmX CPEA (ltrs)</b></TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  <TableRow>
                    <TableCell><b>Dosage Rate (per m³):</b></TableCell>
                    <TableCell>40</TableCell>
                    <TableCell>{searchResult?.primx_flow_dosage_liters}</TableCell>
                    <TableCell>{searchResult?.primx_steel_fibers_dosage_kgs}</TableCell>
                    <TableCell>N/A</TableCell>
                    <TableCell>{searchResult?.primx_cpea_dosage_liters}</TableCell>
                    <TableCell></TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Total Amount:</b></TableCell>
                    <TableCell>{searchResult?.primx_dc_total_amount_needed}</TableCell>
                    <TableCell>{searchResult?.primx_flow_total_amount_needed}</TableCell>
                    <TableCell>{searchResult?.primx_steel_fibers_total_amount_needed}</TableCell>
                    <TableCell>{searchResult?.primx_ultracure_blankets_total_amount_needed}</TableCell>
                    <TableCell>{searchResult?.primx_cpea_total_amount_needed}</TableCell>
                    <TableCell></TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Packaging Capacity:</b></TableCell>
                    <TableCell>1250</TableCell>
                    <TableCell>1000</TableCell>
                    <TableCell>19200</TableCell>
                    <TableCell>600</TableCell>
                    <TableCell>1000</TableCell>
                    <TableCell></TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Packages Needed:</b></TableCell>
                    <TableCell>{searchResult?.primx_dc_packages_needed}</TableCell>
                    <TableCell>{searchResult?.primx_flow_packages_needed}</TableCell>
                    <TableCell>{searchResult?.primx_steel_fibers_packages_needed}</TableCell>
                    <TableCell>{searchResult?.primx_ultracure_blankets_packages_needed}</TableCell>
                    <TableCell>{searchResult?.primx_cpea_packages_needed}</TableCell>
                    <TableCell></TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Total Order Quantity:</b></TableCell>
                    <TableCell>{searchResult?.primx_dc_total_order_quantity}</TableCell>
                    <TableCell>{searchResult?.primx_flow_total_order_quantity}</TableCell>
                    <TableCell>{searchResult?.primx_steel_fibers_total_order_quantity}</TableCell>
                    <TableCell>{searchResult?.primx_ultracure_blankets_total_order_quantity}</TableCell>
                    <TableCell>{searchResult?.primx_cpea_total_order_quantity}</TableCell>
                    <TableCell></TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Materials Price:</b></TableCell>
                    <TableCell>{searchResult?.primx_dc_unit_price}</TableCell>
                    <TableCell>{searchResult?.primx_flow_unit_price}</TableCell>
                    <TableCell>{searchResult?.primx_steel_fibers_unit_price}</TableCell>
                    <TableCell>{searchResult?.primx_ultracure_blankets_unit_price}</TableCell>
                    <TableCell>{searchResult?.primx_cpea_unit_price}</TableCell>
                    <TableCell><b>Totals:</b></TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Total Materials Price:</b></TableCell>
                    <TableCell>{searchResult?.primx_dc_total_materials_price}</TableCell>
                    <TableCell>{searchResult?.primx_flow_total_materials_price}</TableCell>
                    <TableCell>{searchResult?.primx_steel_fibers_total_materials_price}</TableCell>
                    <TableCell>{searchResult?.primx_ultracure_blankets_total_materials_price}</TableCell>
                    <TableCell>{searchResult?.primx_cpea_total_materials_price}</TableCell>
                    <TableCell>{searchResult?.design_total_materials_price}</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Containers:</b></TableCell>
                    <TableCell>{searchResult?.primx_dc_containers_needed}</TableCell>
                    <TableCell>{searchResult?.primx_flow_containers_needed}</TableCell>
                    <TableCell>{searchResult?.primx_steel_fibers_containers_needed}</TableCell>
                    <TableCell>0</TableCell>
                    <TableCell>{searchResult?.primx_cpea_containers_needed}</TableCell>
                    <TableCell>{searchResult?.design_total_containers}</TableCell>

                  </TableRow>

                  <TableRow>
                    <TableCell><b>Shipping Estimate:</b></TableCell>
                    <TableCell>{searchResult?.primx_dc_calculated_shipping_estimate}</TableCell>
                    <TableCell>{searchResult?.primx_flow_calculated_shipping_estimate}</TableCell>
                    <TableCell>{searchResult?.primx_steel_fibers_calculated_shipping_estimate}</TableCell>
                    <TableCell>0</TableCell>
                    <TableCell>{searchResult?.primx_cpea_calculated_shipping_estimate}</TableCell>
                    <TableCell>{searchResult?.design_total_shipping_estimate}</TableCell>

                  </TableRow>

                  <TableRow>
                    <TableCell><b>Total Cost:</b></TableCell>
                    <TableCell><b>{searchResult?.primx_dc_total_cost_estimate}</b></TableCell>
                    <TableCell><b>{searchResult?.primx_flow_total_cost_estimate}</b></TableCell>
                    <TableCell><b>{searchResult?.primx_steel_fibers_total_cost_estimate}</b></TableCell>
                    <TableCell><b>{searchResult?.primx_ultracure_blankets_total_cost_estimate}</b></TableCell>
                    <TableCell><b>{searchResult?.primx_cpea_total_cost_estimate}</b></TableCell>
                    <TableCell><b>{searchResult?.design_total_price_estimate}</b></TableCell>
                  </TableRow>
                  {/* End Metric Table */}


                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

    </div>
  )
}
