import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Button, MenuItem, TextField, InputLabel, Select, Radio, RadioGroup, FormControl, FormLabel, FormControlLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid, InputAdornment } from '@material-ui/core';


import LicenseeHomePage from '../LicenseeHomePage/LicenseeHomePage';
import ButtonToggle from '../ButtonToggle/ButtonToggle';

export default function EstimateLookup() {
  const companies = useSelector(store => store.companies);

  //State Variables
  const [licenseeId, setLicenseeId] = useState('');
  const [estimateNumber, setEstimateNumber] = useState('');

  const dispatch = useDispatch();
  const history = useHistory();
  useEffect(() => {
    // Make the toggle button show this selection:
    dispatch({ type: 'SET_BUTTON_STATE', payload: 'lookup' }),
      dispatch({ type: 'FETCH_COMPANIES' })
  }, []);

  const handleLicenseeChange = (event) => {
    event.preventDefault();
    setLicenseeId(event.target.value)
  }
  const handleEstimateChange = (event) => {
    event.preventDefault();
    setEstimateNumber(event.target.value)
  }

  const handleSubmit = event => {
    event.preventDefault()

    const lookupEstimate = {
        licenseeId: licenseeId,
        estimateNumber: estimateNumber,
    }
    console.log('lookup estimate number and licensee', lookupEstimate);

    dispatch({
        type: 'LOOKUP_ESTIMATE',
        payload: lookupEstimate
    })
    //clear inputs
    setLicenseeId('');
    setEstimateNumber('');
}

  return (
    <div className="EstimateCreate-wrapper">
      {/* <LicenseeHomePage /> */}
      <ButtonToggle />

      <br />

      <Grid container
        spacing={2}
        justify="center"
      >
        <Grid item xs={8}>
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
                        onChange={handleLicenseeChange}
                        required
                        size="small"
                        fullWidth
                        defaultValue="0"
                      >
                        <MenuItem value="0">Please Select</MenuItem>
                        {companies.map(companies => {
                          return (<MenuItem value={companies.id} key ={companies.id}>{companies.licensee_contractor_name}</MenuItem>)
                        }
                        )}
                      </Select>
                    </TableCell>
                  {/* </TableRow>

                  <TableRow> */}
                    <TableCell><b>Estimate Number:</b></TableCell>
                    <TableCell>
                      <TextField
                        onChange={handleEstimateChange}
                        required
                        type="search"
                        size="small"
                        fullWidth
                      />
                    </TableCell>
                  {/* </TableRow>

                  <TableRow> */}
                    <TableCell colspan={2} align="right">
                      <Button
                        type="submit"
                        // onClick={event => handleSubmit(event)}
                        onClick={handleSubmit}
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
    </div>
  )
}
