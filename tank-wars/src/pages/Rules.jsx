import React, { useState } from 'react';
import './Rules.css';

function Rules() {
  return (
    <div style={{ position: 'relative' }}>
      <div className="sub-title">
        <h1>Tank Wars</h1>
      </div>
      <div className="rules-container">
        <ol className="rules-list">
          <li>
            <strong>Objective:</strong> Destroy the tanks of your adversaries and be the last one standing!
          </li>
          <li>
            <strong>Turn Order:</strong> Players take turns to:
            <ol>
              <li>Buy more resources</li>
              <li>Move their tank by clicking</li>
              <li>Fire a projectile</li>
            </ol>
          </li>
          <li>
            Players must calculate the positioning and direction of their tank, the power of their shot, the type of ammunition to use, and other strategic decisions.
          </li>
          <li>
            Use the arrow keys to move the turret, change the power, and spacebar to shoot! 
          </li>
          <li>
            Based on performance in the matches, players will earn rewards that can be used to upgrade their tanks (statistics and ammunition).
          </li>
        </ol>
      </div>
    </div>
  );
}

export default Rules;
