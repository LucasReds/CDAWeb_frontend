import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Rules from "./pages/Rules";
import LoginRegister from "./pages/LoginRegister";
import Navbar from "./components/Navbar";
import ApiTest from "./pages/ApiTest";
import AdminCheck from "./protected/AdminCheck";
import UserCheck from "./protected/UserCheck";
import Register from "./pages/Register";
import Documentacion from "./pages/DocumentacionApi";
import Game from "./pages/Game";

function Layout({ isLoggedIn, setIsLoggedIn }) {
  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about-us" element={<About />} />
          <Route path="/rules" element={<Rules />} />
          <Route
            path="/login-register"
            element={<LoginRegister setIsLoggedIn={setIsLoggedIn} />}
          />
          <Route path="/api-test" element={<ApiTest />} />
          <Route path="/admincheck" element={<AdminCheck />}/>
          <Route path="/usercheck" element={<UserCheck />}/>
          <Route path="/register" element={<Register />}/>
          <Route path="/documentacion" element={<Documentacion />}/>
          <Route path="/phaser-game" element={<Game/>} />
        </Routes>
      </div>
    </>
  );
}

export default function Routing() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <BrowserRouter>
      <Layout isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
    </BrowserRouter>
  );
}
