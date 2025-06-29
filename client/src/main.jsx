import { BrowserRouter } from "react-router";
import { createRoot } from "react-dom/client";
import { Routes, Route } from "react-router";
import "./index.css";
import App from "./App.jsx";
import Login from "./components/Login.jsx";
import Signup from "./components/Signup.jsx";
import Article from "./components/Article.jsx";
import Dashboard from "./components/Dashboard.jsx";
import PostMaker from "./components/PostMaker.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/articles/:id" element={<Article />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/create" element={<PostMaker />} />
      <Route path="/edit/:id" element={<PostMaker />} />
      <Route path="*" element={<h1>Not Found</h1>} />
    </Routes>
  </BrowserRouter>
);
