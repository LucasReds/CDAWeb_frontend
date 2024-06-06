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

        <h2>Ejemplos Endpoint en Web</h2>
    </div>
        <div className='casillas'>
            <div>
                <p>Post /buy</p>
                <p>playerid: 2, boughtItems: pdoer, moneySpent: 10, playerBalance:100</p>
            </div>
            <div>
                <p>Post /move</p>
                <p>playerid: 2, x1: 1, y1: 1, x2: 3, y2:3, currentGas: 50</p>
                <p>Sin embargo, estos valores se mandarán de otra manera al servidor, puesto que este recibe las posiciones como tuplas</p>
            </div>
            <div>
                <p>Post /collission</p>
                <p>playerid: 2, coord_x: 10, coord_y: 10, proyectileRadius: 5, proyectileDamage: 10</p>
            </div>
        </div>
    <div className="centered-text sub-title">
        <Link to="/api-test"> <standardButton > Volver </standardButton> </Link>
    </div>
    </div>
  );
}

export default Documentacion;