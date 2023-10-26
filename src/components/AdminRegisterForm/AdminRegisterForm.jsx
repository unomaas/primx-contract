import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

//MUI Imports
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';


function AdminRegisterForm() {

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
  const classes = useClasses();


  const registerUser = (event) => {
    event.preventDefault();
    dispatch({
      type: 'REGISTER',
      payload: {
        username: username,
        password: password,
				// permission_level: 2,
      },
    });
    dispatch({ type: 'FETCH_ADMIN_INFO' });
    setUsername('');
    setPassword('');
  }; // end registerUser

  useEffect(() => {
    // GET all users on page load
    dispatch({ type: 'FETCH_ADMIN_INFO' });
  }, [])

  return (
    <div>
      <form onSubmit={registerUser}>
        <h2>Register New Admin</h2>
        <p>Use this page to create a new administrator account for another user.</p>
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
            value={username}>
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
            value={password}>
            Password:
        </TextField>
        </div> <br />

        <div>
          <Button
            type="submit"
            // onClick={registerUser}
            variant="contained"
            color="primary"
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

export default AdminRegisterForm;
