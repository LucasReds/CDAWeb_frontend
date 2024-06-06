import React from "react";
import { Link } from "react-router-dom";
import StandardButton from "../components/standardButton";
import "./Navbar.css";

function Navbar({ isLoggedIn, setIsLoggedIn }) {
  const handleLogout = () => {
    setIsLoggedIn(false);
    alert("Logged out");
  };

  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link to="/">
            <StandardButton>Home</StandardButton>
          </Link>
        </li>
        <li>
          <Link to="/about-us">
            <StandardButton>About Us</StandardButton>
          </Link>
        </li>
        <li>
          <Link to="/rules">
            <StandardButton>Rules</StandardButton>
          </Link>
        </li>
        <li>
          <Link to="/api-test">
            <StandardButton>API test</StandardButton>
          </Link>
        </li>
        {isLoggedIn ? (
          <>
            <li>
              <Link to="/usercheck">
                <StandardButton>Profile</StandardButton>
              </Link>
            </li>
            <li>
              <StandardButton onClick={handleLogout}>Logout</StandardButton>
            </li>
          </>
        ) : (
          <li>
            <Link to="/login-register">
              <StandardButton>Login/Register</StandardButton>
            </Link>
          </li>
        )}
        {/* Visual indicator */}
        {isLoggedIn && (
          <li>
            <div className="logged-in-indicator">Logged In</div>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
