import React from 'react';

import { useHistory } from 'react-router-dom';
import AdminRegisterForm from '../AdminRegisterForm/AdminRegisterForm';

function AdminRegisterPage() {
  const history = useHistory();

  return (
    <div>
      <AdminRegisterForm />

      <center>
        <button
          type="button"
          className="btn btn_asLink"
          onClick={() => {
            history.push('/login');
          }}
        >
          Login
        </button>
      </center>
    </div>
  );
}

export default AdminRegisterPage;
