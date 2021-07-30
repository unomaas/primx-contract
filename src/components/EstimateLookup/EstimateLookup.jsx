import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Button, MenuItem, TextField, InputLabel, Select, Radio, RadioGroup, FormControl, FormLabel, FormControlLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid, InputAdornment, FormHelperText, Box } from '@material-ui/core';
import { useStyles } from '../MuiStyling/MuiStyling';


import LicenseeHomePage from '../LicenseeHomePage/LicenseeHomePage';
import ButtonToggle from '../ButtonToggle/ButtonToggle';

export default function EstimateLookup() {
  const companies = useSelector(store => store.companies);
  const [searchQuery, setSearchQuery] = useState({
    licensee_id: "0",
    id: ""
  });
  const [error, setError] = useState(false);
  const classes = useStyles();
  const [selectError, setSelectError] = useState("");


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
    console.log('In handleSubmit')
    // ⬇ Select dropdown validation:
    if (searchQuery.licensee_id !== "0") {
      // If they selected a company name from dropdown:
      console.log("Submitting.");
    } else {
      // If they haven't, pop up warning and prevent them:
      console.log(("Not submitting."));
      setError(true);
      setSelectError("Please select a value.");
    }
  };



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
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Placement Type:</b></TableCell>
                    <TableCell>
                      CONTENT
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Unit of Measurement:</b></TableCell>
                    <TableCell>
                      CONTENT
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Today's Date:</b></TableCell>
                    <TableCell>
                      CONTENT

                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Anticipated First Pour Date:</b></TableCell>
                    <TableCell>
                      CONTENT
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
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Shipping City:</b></TableCell>
                    <TableCell>
                      CONTENT
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Shipping State/Province:</b></TableCell>
                    <TableCell>
                      CONTENT
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Shipping Zip/Postal Code:</b></TableCell>
                    <TableCell>
                      CONTENT
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Shipping Country:</b></TableCell>
                    <TableCell>
                      CONTENT
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
                      CONTENT
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Thickness (in):</b></TableCell>
                    <TableCell>
                      CONTENT
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Cubic Yards:</b></TableCell>
                    <TableCell>
                      CONTENT
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Thickening @ Perimeter (yd³):</b></TableCell>
                    <TableCell>
                      CONTENT
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Thickening @ Construction Joints (yd³):</b></TableCell>
                    <TableCell>
                      CONTENT
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Subtotal:</b></TableCell>
                    <TableCell>
                      CONTENT
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Waste Factor @ 5%:</b></TableCell>
                    <TableCell>
                      CONTENT
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Total Cubic Yards:</b></TableCell>
                    <TableCell>
                      CONTENT
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
                      CONTENT
                    </TableCell>
                    <TableCell>
                      CONTENT
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
                      CONTENT
                    </TableCell>
                    <TableCell>
                      CONTENT
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Cubic Yards:</b></TableCell>
                    <TableCell>
                      CONTENT
                    </TableCell>
                    <TableCell>
                      CONTENT
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
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell></TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Total Amount:</b></TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell></TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Packaging Capacity:</b></TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell></TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Packages Needed:</b></TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell></TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Total Order Quantity:</b></TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell></TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Materials Price:</b></TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell><b>Totals:</b></TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Total Materials Price:</b></TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Containers:</b></TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>

                  </TableRow>

                  <TableRow>
                    <TableCell><b>Shipping Estimate:</b></TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>

                  </TableRow>

                  <TableRow>
                    <TableCell><b>Total Cost:</b></TableCell>
                    <TableCell><b>CALC</b></TableCell>
                    <TableCell><b>CALC</b></TableCell>
                    <TableCell><b>CALC</b></TableCell>
                    <TableCell><b>CALC</b></TableCell>
                    <TableCell><b>CALC</b></TableCell>
                    <TableCell><b>CALC</b></TableCell>
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
                      CONTENT
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Thickness (mm):</b></TableCell>
                    <TableCell>
                      CONTENT
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Cubic Meters:</b></TableCell>
                    <TableCell>
                      CONTENT
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Thickening @ Perimeter (m³):</b></TableCell>
                    <TableCell>
                      CONTENT
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Thickening @ Construction Joints (m³):</b></TableCell>
                    <TableCell>
                      CONTENT
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Subtotal:</b></TableCell>
                    <TableCell>
                      CONTENT
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Waste Factor @ 5%:</b></TableCell>
                    <TableCell>
                      CONTENT
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Total Cubic Meters:</b></TableCell>
                    <TableCell>
                      CONTENT
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
                      CONTENT
                    </TableCell>
                    <TableCell>
                      CONTENT
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Width (m³):</b></TableCell>
                    <TableCell>
                      5
                    </TableCell>
                    <TableCell>
                      10
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Additional Thickness (mm):</b></TableCell>
                    <TableCell>
                      CONTENT
                    </TableCell>
                    <TableCell>
                      CONTENT
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Cubic Meters:</b></TableCell>
                    <TableCell>
                      CONTENT
                    </TableCell>
                    <TableCell>
                      CONTENT
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
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell></TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Total Amount:</b></TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell></TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Packaging Capacity:</b></TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell></TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Packages Needed:</b></TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell></TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Total Order Quantity:</b></TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell></TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Materials Price:</b></TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell><b>Totals:</b></TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Total Materials Price:</b></TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell><b>Containers:</b></TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>

                  </TableRow>

                  <TableRow>
                    <TableCell><b>Shipping Estimate:</b></TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>
                    <TableCell>CALC</TableCell>

                  </TableRow>

                  <TableRow>
                    <TableCell><b>Total Cost:</b></TableCell>
                    <TableCell><b>CALC</b></TableCell>
                    <TableCell><b>CALC</b></TableCell>
                    <TableCell><b>CALC</b></TableCell>
                    <TableCell><b>CALC</b></TableCell>
                    <TableCell><b>CALC</b></TableCell>
                    <TableCell><b>CALC</b></TableCell>
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
