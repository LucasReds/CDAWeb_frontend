import React from 'react';
import playButton from '../components/playButton';
import standardButton from '../components/standardButton';
import './Home.css';
import { Link } from 'react-router-dom';

function Documentacion() {
  return (
    <div style={{ position: 'relative' }}>
      <div className="centered-text sub-title">
        <h1>Documentación Api</h1>
        <Link to="/api-test"> <standardButton > Volver </standardButton> </Link>
      </div>
    </div>
  );
}

export default Documentacion;