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
import ProtectedRoute from "./components/ProtectedRoute.jsx";

createRoot(document.getElementById("root")).render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/articles/:id" element={<Article />} />
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/create"
                element={
                    <ProtectedRoute>
                        <PostMaker />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/edit/:id"
                element={
                    <ProtectedRoute>
                        <PostMaker />
                    </ProtectedRoute>
                }
            />
            <Route path="*" element={<h1>Not Found</h1>} />
        </Routes>
    </BrowserRouter>
);
