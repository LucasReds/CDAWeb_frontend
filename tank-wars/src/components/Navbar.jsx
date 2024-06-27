import React, { useContext } from "react";
import { Link } from "react-router-dom";
import StandardButton from "../components/standardButton";
import "./Navbar.css";
import { AuthContext } from "../auth/AuthContext";

function Navbar({ isLoggedIn, setIsLoggedIn }) {
  const { token, userId, setToken, setUserId } = useContext(AuthContext);
  console.log(userId, typeof userId);

  const handleLogout = () => {
    setIsLoggedIn(false);
    alert("Logged out");
    setToken(null);
    setUserId(null);
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
        {userId && userId !== "null" ? (
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
        {userId && userId !== "null" && (
          <li>
            <div className="logged-in-indicator">Logged In</div>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
