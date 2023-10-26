import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';


//MUI Imports
// import TextField from '@material-ui/core/TextField';
// import Button from '@material-ui/core/Button';
import { useClasses } from '../MuiStyling/MuiStyling';
import { Button, MenuItem, TextField, Select, FormControl, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid, FormHelperText, Snackbar } from '@material-ui/core';



function LicenseeLoginForm() {
	//defining username and password - setting state to empty string
	const [username, setUsername] = useState('');
	const [company, setCompany] = useState(0);
	const [password, setPassword] = useState('');
	const [error, setError] = useState(false);
	const [selectError, setSelectError] = useState("");
	const companies = useSelector(store => store.companies);
	//puls in errors from reducer
	const errors = useSelector(store => store.errors);
	const dispatch = useDispatch();
	const history = useHistory();
	//defining classes for MUI
	const classes = useClasses();
	// ⬇ Run on page load:
	useEffect(() => {
		// ⬇ Fetch the current companies for drop-down menu options:
		dispatch({ type: 'FETCH_ACTIVE_COMPANIES' });
	}, []);

	const login = (event) => {
		event.preventDefault();

		// ⬇ Clearing validation each time: 
		setError(false);
		setSelectError("");
		// ⬇ Select dropdown validation:
		if (company == 0) {
			// If they haven't, pop up warning and prevent them:
			setError(true);
			setSelectError("Please select a company.");
		}
		//loggs in user and sends them to /user page / admin landing page - if incorrect user/password, user is given an error
		if (username && password) {
			dispatch({
				type: 'LOGIN_LICENSEE',
				payload: {
					username: username,
					password: password,
					// licensee_id: company,
				},
			});
			history.push('/SavedEstimates');
		} else {
			dispatch({ type: 'LOGIN_INPUT_ERROR' });
		}
	}; // end login

	return (
		<div>

			<h2>Welcome, Contractor</h2>

			{errors.loginMessage && (
				<h3 className="alert" role="alert">
					{errors.loginMessage}
				</h3>
			)}

			<form onSubmit={login}>

				<div>
					<TextField
						required
						htmlFor="username"
						name="username"
						label="Username"
						variant="outlined"
						onChange={(event) => setUsername(event.target.value)}
						value={username}>
						Username:
					</TextField>
				</div>

				<br />

				<div>
					<TextField
						required
						htmlFor="password"
						name="password"
						label="Password"
						variant="outlined"
						type="password"
						onChange={(event) => setPassword(event.target.value)}
						value={password}>
						Password:
					</TextField>
				</div> <br />

				{/* <div>
					<FormControl error={error}>
						<Select
							// onChange={event => handleChange('licensee_id', event.target.value)}
							onChange={event => setCompany(event.target.value)}
							required
							size="small"
							fullWidth
							value={company}
							variant="outlined"
						>
							<MenuItem key="0" value="0">Please Select</MenuItem>
							{companies.map(companies => {
								return (<MenuItem key={companies.licensee_id} value={companies.licensee_id}>{companies.licensee_contractor_name}</MenuItem>)
							}
							)}
						</Select>
						<FormHelperText>{selectError}</FormHelperText>
					</FormControl>
				</div> <br /> */}

				<div>
					<Button
						type="submit"
						variant="contained"
						color="primary"
						value="Log In"
						className={classes.LexendTeraFont11}
					>
						Log in
					</Button>
				</div>

			</form>
		</div>
	);
}

export default LicenseeLoginForm;
