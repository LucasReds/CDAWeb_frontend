import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Rules from './pages/Rules';
import LoginRegister from './pages/LoginRegister';
import Navbar from './components/Navbar';

function Layout({ isLoggedIn, setIsLoggedIn }) {
  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about-us" element={<About />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="/login-register" element={<LoginRegister setIsLoggedIn={setIsLoggedIn} />} />
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
