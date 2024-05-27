import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";

export default function Routing() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/instructions" element={<h1>Pagina instrucciones</h1>} />
          <Route path="/about-us" element={<h1>Sobre nosotros</h1>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
