import React from 'react';
import './standardButton.css';

function Button({ onClick, children }) {
  return (
    <button class="standard-button" onClick={onClick}>
      {children}
    </button>
  );
}

export default Button;
