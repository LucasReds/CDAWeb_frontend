import React, { useState, useEffect } from 'react';
import './winnerDisplay.css'; // You'll need to create this CSS file

const WinnerDisplay = ({ show, winner, onClose }) => {
  if (!show) return null;

  const handleHomeClick = () => {
    window.location.href = '/';
  };

  return (
    <div className="winner-backdrop">
      <div className="winner-container">
        <button className="winner-close-button" onClick={onClose}>X</button>
        <h1>Congratulations!</h1>
        <p>The winner is: {winner}</p>
        <button className="home-button" onClick={handleHomeClick}>Go to Home</button>
      </div>
    </div>
  );
};

export default WinnerDisplay;
