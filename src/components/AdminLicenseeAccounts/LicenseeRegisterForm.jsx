import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

//MUI Imports
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';


export default function LicenseeRegisterForm() {

	const errors = useSelector((store) => store.errors);
	//defining states for sending data to server
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
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
				// permission_level: 3,
				licensees_id: licensees_id,
			},
		});
		// TODO: Build and change this API call. 
		dispatch({ type: 'FETCH_LICENSEE_INFO' });
		setUsername('');
		setPassword('');
	}; // end registerUser

	useEffect(() => {
		// GET all users on page load
		// TODO: Same here. 
		dispatch({ type: 'FETCH_LICENSEE_INFO' });
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

				<div>
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
					</TextField>
				</div> <br />

				<div>
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


					{/* // TODO: Build a select dropdown for the companies here.  Need an API call for that too.  */}

				</div> <br />

				<div>
					<Button
						type="submit"
						// onClick={registerUser}
						variant="contained"
						color="primary"
						className="btn"
						value="Register"
						className={classes.LexendTeraFont11}
					>
						Register
					</Button>
				</div>
			</form>
		</div>

	);
}

