import React, { useState, useContext } from 'react';
import { AuthContext } from '../auth/AuthContext';
import axios from 'axios';
import './Home.css';


function LoginRegister({ setIsLoggedIn }) {
  const { token, setToken } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [msg, setMsg] = useState("");


  const handleLogin = async (event) => {
    event.preventDefault();

    axios.post(`http://localhost:3000/login`, {
      username: username,
      password: password
    }).then((response) => {
      console.log('Login successful');
      console.log(response);
      setError(false);
      setMsg("Login exitoso!");
      // Recibimos el token y lo procesamos
      const access_token = response.data.access_token;
      localStorage.setItem('token', access_token);
      setToken(access_token);
      console.log("Se seteo el token: ", token);
      setIsLoggedIn(true);
      alert('Logged in');
    }).catch((error) => {
      console.error('An error occurred while trying to login:', error);
      setError(true);// aquí puede haber más lógica para tratar los errores
      setIsLoggedIn(false);
      alert('Error logging in');
    })
  };

  return (
    <div className="Login">
      {msg.length > 0 && <div className="successMsg"> {msg} </div>}

      {error && <div className="error">Hubo un error con el Login, por favor trata nuevamente.</div>}
      <form onSubmit={handleLogin}>
        <label>
          Username:
          <input 
            type="username" 
            name="username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
        </label>
        <label>
          Password:
          <input
            type="password" 
            name="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </label>
        <input type="submit" value="Enviar" />
      </form>
    </div>
  );
}

export default LoginRegister;