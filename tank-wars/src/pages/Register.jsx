import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Home.css';
import { Link } from "react-router-dom";
import StandardButton from "../components/standardButton";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [msg, setMsg] = useState("");
  const [requirements, setRequirements] = useState({
    minLength: false,
    hasCapitalLetter: false,
    hasNonLetter: false,
  });

  useEffect(() => {
    setRequirements({
      minLength: /.{8,}/.test(password),
      hasCapitalLetter: /[A-Z]/.test(password),
      hasNonLetter: /[^a-zA-Z]/.test(password),
    });
  }, [password]);

  const validatePassword = (password) => {
    return requirements.minLength && requirements.hasCapitalLetter && requirements.hasNonLetter;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validatePassword(password)) {
      setError(true);
      setMsg("La contraseña debe tener al menos 8 caracteres, una letra mayúscula y un carácter no alfabético.");
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
            <div className="password-checklist">
              <ul>
                <li className={requirements.minLength ? "valid" : "invalid"}>
                  Al menos 8 caracteres
                </li>
                <li className={requirements.hasCapitalLetter ? "valid" : "invalid"}>
                  Al menos una letra mayúscula
                </li>
                <li className={requirements.hasNonLetter ? "valid" : "invalid"}>
                  Al menos un carácter no alfabético
                </li>
              </ul>
            </div>
            <div className='sep'>
                <StandardButton type="submit" value="Enviar">Enviar</StandardButton>
            </div>
        </form>
      </div>
    </div>
  );
}

export default Register;


