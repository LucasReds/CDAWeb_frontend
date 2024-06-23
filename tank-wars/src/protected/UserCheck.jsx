import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../auth/AuthContext';
import '../pages/Home.css';

const UserCheck = () => {
  const { token, userId } = useContext(AuthContext); // Retrieve token and userId from context
  const [status, setStatus] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (token && userId) {
      console.log('UserCheck with userId:', userId);
      axios({
        method: 'get',
        url: 'http://localhost:3000/protectedUser',
        headers: {
          'Authorization': `Bearer ${token}`,
          'User-ID': userId // Add User-ID header to send userId
        }
      })
      .then(response => {
        console.log(response.data.user);
        setUserData(response.data.user); // Assuming response contains user data
        setStatus('authorized');
      })
      .catch(error => {
        console.log('No estás autorizado para estar aquí');
        setStatus('unauthorized');
      });
    }
  }, [token, userId]);

  return (
    <div className="Perfil">
      {status === 'authorized' && userData && (
        <>
          <h1 className="centered-text">Bienvenido a tu Perfil</h1>
          <table className="vertical-table">
            <tbody>
              <tr>
                <td><strong>ID</strong></td>
                <td>{userData.id}</td>
              </tr>
              <tr>
                <td><strong>Username</strong></td>
                <td>{userData.username}</td>
              </tr>
              <tr>
                <td><strong>Money</strong></td>
                <td>{userData.money}</td>
              </tr>
              <tr>
                <td><strong>Level</strong></td>
                <td>{userData.level}</td>
              </tr>
              <tr>
                <td><strong>XP</strong></td>
                <td>{userData.xp}</td>
              </tr>
              <tr>
                <td><strong>Created At</strong></td>
                <td>{new Date(userData.createdAt).toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </>
      )}
      {status !== 'authorized' && (
        <>
          <h1 className="centered-text">No estás autorizado para estar aquí</h1>
          <p className="centered-text">Por favor, inicia sesión para acceder a tu perfil.</p>
        </>
      )}
    </div>
  );
}

export default UserCheck;