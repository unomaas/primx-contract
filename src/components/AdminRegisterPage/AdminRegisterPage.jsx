import React from 'react';

import { useHistory } from 'react-router-dom';
import AdminRegisterForm from '../AdminRegisterForm/AdminRegisterForm';

//MUI imports
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';


function AdminRegisterPage() {
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
      <AdminRegisterForm />
      </center>
      
      <center>
        <Button  
          color="primary"
          type="button"
          className="btn btn_asLink"
          onClick={() => {
            history.push('/login');
          }}
        >
          Login
        </Button>
      </center>
    </div>
  );
}

export default AdminRegisterPage;
