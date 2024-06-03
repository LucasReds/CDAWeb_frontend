import React from 'react';
import './playButton.css';

function Button({ onClick, children }) {
  return (
    <button class="play-button" onClick={onClick}>
      {children}
    </button>
  );
}

export default Button;
