import React from 'react';
import AdminLoginForm from '../AdminLoginForm/AdminLoginForm';
import { useHistory } from 'react-router-dom';

//MUI imports
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';


function AdminLoginPage() {
  const history = useHistory();

  //Styles for MUI
  const useStyles = makeStyles((theme) => ({
    root: {
      '& > *': {
        margin: theme.spacing(1),
      },
    },
  }));
  //defining classes MUI
  const classes = useStyles();

  return (
    <div>
      <center>
        <AdminLoginForm />
      </center>
    </div>
  );
}

export default AdminLoginPage;
