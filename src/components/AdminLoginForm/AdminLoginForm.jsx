import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {useSelector} from 'react-redux';
import { useHistory } from 'react-router-dom';


//MUI Imports
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

function AdminLoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const errors = useSelector(store => store.errors);
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

  const login = (event) => {
    event.preventDefault();

    if (username && password) {
      dispatch({
        type: 'LOGIN',
        payload: {
          username: username,
          password: password,
        },
      });
      history.push('/user');
    } else {
      dispatch({ type: 'LOGIN_INPUT_ERROR' });
    }
  }; // end login

  return (
    <form className={classes.root} onSubmit={login}>
      <h2>Welcome, Admin</h2>
      {errors.loginMessage && (
        <h3 className="alert" role="alert">
          {errors.loginMessage}
        </h3>
      )}
      <div>
        <TextField 
        required
        id="outlined-basic" 
        htmlFor="username"
        name="username" 
        label="Username" 
        variant="outlined" 
        onChange={(event) => setUsername(event.target.value)} 
        value={username}>
          Username:
        </TextField>
      </div>
      <div>
        <TextField 
        required
        id="outlined-basic"
        htmlFor="password" 
        name="password"
        label="Password"
        variant="outlined"
        type="password"
        onChange={(event) => setPassword(event.target.value)} 
        value={password}>
          Password:
        </TextField>
      </div>
      <div>
        <Button onClick={login} variant="contained" color="primary" className="btn" value="Log In">Log in</Button>
      </div>
    </form>
  );
}

export default AdminLoginForm;
