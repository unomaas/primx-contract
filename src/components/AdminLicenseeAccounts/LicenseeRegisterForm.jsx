import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

//MUI Imports
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { Button, Select, MenuItem } from '@material-ui/core';


export default function LicenseeRegisterForm() {

	const errors = useSelector((store) => store.errors);
	//defining states for sending data to server
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [company, setCompany] = useState(0);
	const companies = useSelector(store => store.companies);
	const dispatch = useDispatch();
	//styles for MUI
	const useStyles = makeStyles((theme) => ({
		root: {
			'& > *': {
				margin: theme.spacing(1),
				width: '25ch',
			},
		},
	}));
	//defining classes for MUI
	const classes = useStyles();

	const registerUser = (event) => {
		event.preventDefault();
		dispatch({
			type: 'REGISTER_LICENSEE',
			payload: {
				username: username,
				password: password,
				licensee_id: company,
			},
		});
		setUsername('');
		setPassword('');
		setCompany(0);
		// dispatch({ type: 'FETCH_LICENSEE_INFO' });
	}; // end registerUser

	useEffect(() => {
		// GET all users on page load
		dispatch({ type: 'FETCH_FIELD_SELECT' });
	}, [])

	return (
		<div>
			<form onSubmit={registerUser}>
				<h2>Register New Licensee User Account</h2>
				<p>Use this to create a new user account for a licensee.</p>
				{errors.registrationMessage && (
					<h3 className="alert" role="alert">
						{errors.registrationMessage}
					</h3>
				)}

				{/* <div> */}
				<TextField
					required
					htmlFor="username"
					name="username"
					label="Username"
					variant="outlined"
					onChange={(event) => setUsername(event.target.value)}
					value={username}
				>
					Username:
				</TextField> &nbsp;&nbsp;
				{/* </div> <br />

				<div> */}

				<TextField
					required
					htmlFor="password"
					name="password"
					label="Password"
					variant="outlined"
					type="password"
					onChange={(event) => setPassword(event.target.value)}
					value={password}
				>
					Password:
				</TextField>

				<br /> <br />

				<Select
					// onChange={event => handleChange('licensee_id', event.target.value)}
					onChange={(event) => setCompany(event.target.value)}
					required
					size="small"
					value={company}
					variant="outlined"
				>
					<MenuItem key="0" value="0">Please Select</MenuItem>
					{companies.map(companies => {
						return (
							
							<MenuItem 
							key={companies.licensee_id} 
							value={companies.licensee_id}
							disabled={companies.licensee_contractor_name === "No Licensee"}
							>
								{companies.licensee_contractor_name}
							</MenuItem>
						)
					})}
				</Select>

				<br /> <br />

				<Button
					type="submit"
					// onClick={registerUser}
					variant="contained"
					color="primary"
					// className="btn"
					value="Register"
					className={`${classes.LexendTeraFont11} btn`}
				>
					Register
				</Button>

			</form>
		</div>

	);
}

