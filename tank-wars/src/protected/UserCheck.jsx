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
          <h1>Bienvenido a tu Perfil</h1>
          <table className="user-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Money</th>
                <th>Level</th>
                <th>XP</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{userData.id}</td>
                <td>{userData.username}</td>
                <td>{userData.money}</td>
                <td>{userData.level}</td>
                <td>{userData.xp}</td>
                <td>{new Date(userData.createdAt).toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
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