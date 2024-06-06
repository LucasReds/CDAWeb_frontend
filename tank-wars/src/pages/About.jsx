import React from 'react';
import './About.css';

function About() {
  return (
    <div className="about-container">
      <div className="about-content">
        <h1 className="about-title">About Us</h1>
        <h2 className="about-subtitle">Nuestro Equipo</h2>
        <div className="team-member">
          <h3>Domingo Venegas</h3>
          <p>Bio: Hola Mundo</p>
        </div>
        <div className="team-member">
          <h3>Cristian Gandarillas</h3>
          <p>Bio: Hola Mundo</p>
        </div>
        <div className="team-member">
          <h3>Lucas Rojas</h3>
          <p>Bio: Hola Mundo</p>
        </div>
        <h2 className="about-subtitle">Curso</h2>
        <p className="course-info">IIC2513 - Tecnologías y Aplicaciones Web.</p>
      </div>
    </div>
  );
}

export default About;
