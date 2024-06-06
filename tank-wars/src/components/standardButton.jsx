import React from "react";
import "./standardButton.css";

function Button({ onClick, children }) {
  return (
    <button className="standard-button" onClick={onClick}>
      {children}
    </button>
  );
}

export default Button;
