import { BrowserRouter } from "react-router";
import { createRoot } from "react-dom/client";
import { Routes, Route } from "react-router";
import "./index.css";
import App from "./App.jsx";
import Login from "./components/Login.jsx";
import Signup from "./components/Signup.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  </BrowserRouter>
);
