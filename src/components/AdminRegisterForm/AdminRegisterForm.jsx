import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

//MUI Imports
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';



function AdminRegisterForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const errors = useSelector((store) => store.errors);
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
      type: 'REGISTER',
      payload: {
        username: username,
        password: password,
      },
    });
  }; // end registerUser

  return (
    <form className={classes.root} onSubmit={registerUser}>
      <h2>Register New Admin</h2>
      {errors.registrationMessage && (
        <h3 className="alert" role="alert">
          {errors.registrationMessage}
        </h3>
      )}
      <div>
        <TextField id="outlined-basic" label="Username" variant="outlined" onChange={(event) => setUsername(event.target.value)} value={username} htmlFor="username">
          Username:
          <input
            type="text"
            name="username"
            
            required
            
          />
        </TextField>
      </div>
      <div>
        <TextField id="outlined-basic"  label="Password" variant="outlined" htmlFor="password" onChange={(event) => setPassword(event.target.value)} value={password}>
          Password:
          <input
            type="password"
            name="password"
            
            required
            
          />
        </TextField>
      </div>
      <div>
        <Button onClick={registerUser} variant="contained" color="primary" className="btn" value="Register">Register</Button>
      </div>
    </form>
  );
}

export default AdminRegisterForm;
