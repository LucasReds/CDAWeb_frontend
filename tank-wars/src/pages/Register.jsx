import React, { useState } from 'react';
import axios from 'axios';
import './Home.css';
import { Link } from "react-router-dom";
import StandardButton from "../components/standardButton";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [msg, setMsg] = useState("");

  const validatePassword = (password) => {
    const minLength = /.{8,}/;
    const hasCapitalLetter = /[A-Z]/;
    const hasNonLetter = /[^a-zA-Z]/;
    return minLength.test(password) && hasCapitalLetter.test(password) && hasNonLetter.test(password);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validatePassword(password)) {
      setError(true);
      setMsg("La contraseña debe tener al menos 8 caracteres, una letra mayúscula y un carácter no alfabético.");
      console.log("La contraseña debe tener al menos 8 caracteres, una letra mayúscula y un carácter no alfabético.")
      return;
    }

    axios.post(`http://localhost:3000/signup`, {
        username: username,
        password: password
      }).then((response) => {
        console.log('Registro exitoso! Ahora puedes volver y loguearte');
        setError(false);
        setMsg('Registro exitoso! Ahora puedes volver y loguearte');
      }).catch((error) => {      
      console.error('Ocurrió un error:', error);
      setError(true); // aquí puede haber más lógica para tratar los errores
      });
    }

  return (
    <div className='textoBajoNav'>
        <h1 className='centered-text sub-title'>Registro</h1>
        <div className="Login">
        {msg.length > 0 && error && <div className="error"> {msg} </div>}
        {msg.length > 0 && !error && <div className="successMsg"> {msg} </div>}

        <form onSubmit={handleSubmit}>
            <label>
            Username:
            <input 
                type="text" 
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
            <div className='sep'>
                <StandardButton type="submit" value="Enviar">Enviar</StandardButton>
            </div>
        </form>
      </div>
    </div>
  );
}

export default Register;

