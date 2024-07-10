import React, { useState } from 'react';
import './Rules.css';

function Rules() {
  return (
    <div style={{ position: 'relative' }}>
      <div className="sub-title">
        <h1>Tank Wars</h1>
      </div>
      <div className="rules-container">
        <ul className="rules-list">
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
            Players must calculate the positioning and direction of their tank, the power of their shot, the type of ammunition to use, and where to move.
          </li>
          <li>
            <strong>Controls:</strong>
            <ul className="controls-list">
              <li><strong>↑</strong> Change turret angle up</li>
              <li><strong>↓</strong> Change turret angle down</li>
              <li><strong>←</strong> Decrease shot power</li>
              <li><strong>→</strong> Increase shot power</li>
              <li><strong>SPACE</strong> Shoot projectile</li>
              <li><strong>CLICK</strong> Move tank to a valid location</li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Rules;
