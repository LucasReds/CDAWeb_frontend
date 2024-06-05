import React, { useEffect, useState , useContext} from 'react';
import axios from 'axios';
import { AuthContext } from '../auth/AuthContext';
import '../pages/Home.css';

const UserCheck = () => { 
  const { token } = useContext(AuthContext)
  const [status, setStatus] = useState(null);

  useEffect(() => {
    console.log(token);
    console.log('UserCheck');
    axios({
      method: 'get',
      url: `http://localhost:3000/protectedUser`,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        console.log(response.data.user)
        console.log('Estas autorizado para estar aquí')
        setStatus('authorized')
      })
      .catch(error => {
        console.log('No estas autorizado para estar aquí')
        setStatus('unauthorized');
      });
  }, []);


  return (
    /* Queremos las cosas dentro del div se muestren solo si esta autorizado */
    <div className="Perfil">
      {status === 'authorized' && (
        <>
          <h1>Bienvenido a tu Perfil</h1>
          <p>Puedes visualizar tus estadísticas aquí:</p>
        </>
      )}
      {status !== 'authorized' && (
        <>
          <h1>No estás autorizado para estar aquí</h1>
          <p>Por favor, inicia sesión para acceder a tu perfil.</p>
        </>
      )}
    </div>
  );
}

export default UserCheck;