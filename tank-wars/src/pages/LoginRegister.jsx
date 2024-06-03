import React, { useState } from 'react';

function LoginRegister({ setIsLoggedIn }) {
  const handleLogin = () => {
    setIsLoggedIn(true);
    alert('Logged in');
  };

  return (
    <div>
      <h1>Login/Register</h1>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default LoginRegister;
