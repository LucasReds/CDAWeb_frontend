import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Home from "./pages/Home";
import About from "./pages/About";
import Rules from "./pages/Rules";

export default function Routing() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="/about-us" element={<About />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
