import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';


//MUI Imports
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { useClasses } from '../MuiStyling/MuiStyling';

import { useParams, useLocation } from 'react-router';




function AdminLoginForm() {
	//defining username and password - setting state to empty string
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const user = useSelector((store) => store.user);
	const location = useLocation();

	useEffect(() => {
		// ! User permission levels are: 1 for Super Admin, 2 for Regular Admin, 3 for Region Admin, 4 for Licensees, 5 for Public.  Right?  Let's make it, 1 - 3 - 5 - 7?  1 for Super, 3 for Regular, 5 for Regional, 7 for Licensee, 9 for... anything else?  Actually, let's do 1-2-3-4. 1 Super, 2 Regular, 3 Regional, 4 Licensee. 
		// ! : User permissions USED TO BE 1, 2, 3.  1 Super, 2 regular, 3 licensee.  

		// ⬇ If it's a Licensee user or higher, push to create. 
		if (user?.permission_level >= 4) {
			history.push('/create');
		}
		// ⬇ If it's a Regional user or lower, push to user.
		if (user?.permission_level <= 3) {
			history.push('/user');
		}
	}, [user, history]);

	//puls in errors from reducer
	const errors = useSelector(store => store.errors);

	const dispatch = useDispatch();
	const history = useHistory();

	//defining classes for MUI
	const classes = useClasses();

	const login = (event) => {
		event.preventDefault();
		//loggs in user and sends them to /user page / admin landing page - if incorrect user/password, user is given an error
		if (username && password) {
			dispatch({
				type: 'LOGIN',
				payload: {
					username: username,
					password: password,
				},
			});

		} else {
			dispatch({ type: 'LOGIN_INPUT_ERROR' });
		}
	}; // end login

	return (
		<div>
			<center>

				<h2>Please login to proceed:</h2>
				<br />

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

					<div>
						<Button
							type="submit"
							variant="contained"
							color="primary"
							value="Log In"
							className={`${classes.LexendTeraFont11} btn`}
						>
							Log in
						</Button>
					</div>

				</form>
			</center>

		</div>
	);
}

export default AdminLoginForm;
