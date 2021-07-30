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
      TEST TEST TEST 
      <center>
        <AdminLoginForm />
      </center>
      {/* 
      <center>
        <Button
          color="primary"
          type="button"
          className="btn btn_asLink"
          onClick={() => {
            history.push('/registration');
          }}
        >
          Register
        </Button>
      </center> */}
    </div>
  );
}

export default AdminLoginPage;
