import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from "react-router-dom";


//MUI Imports
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';



function AdminRegisterForm() {

  const errors = useSelector((store) => store.errors);
  const snack = useSelector(store => store.snackBar);

  //defining states for sending data to server
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const history = useHistory();

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
      type: 'REGISTER',
      payload: {
        username: username,
        password: password,
      },
    });
    dispatch({ type: 'FETCH_USERINFO' });
    setUsername('');
    setPassword('');
  }; // end registerUser

  //sets snack bar notification to closed after appearing
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    dispatch({type: 'SET_CLOSE'})
  };

  useEffect(() => {
    // GET all users on page load
    dispatch({ type: 'FETCH_USERINFO' });
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
            className="btn"
            value="Register"
            className={classes.LexendTeraFont11}
          >
            Register
        </Button>
        </div>
      </form>

      {/* Snackbar configures all of the info pop-ups required. */}
      <Snackbar
        open={snack.open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          variant={snack.variant}
          onClose={handleClose}
          severity={snack.severity}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </div>

  );
}

export default AdminRegisterForm;
