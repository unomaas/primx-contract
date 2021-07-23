import React from 'react';
import LoginForm from '../AdminLoginForm/AdminLoginForm';
import { useHistory } from 'react-router-dom';

function AdminLoginPage() {
  const history = useHistory();

  return (
    <div>
      <AdminLoginForm />

      <center>
        <button
          type="button"
          className="btn btn_asLink"
          onClick={() => {
            history.push('/registration');
          }}
        >
          Register
        </button>
      </center>
    </div>
  );
}

export default AdminLoginPage;
