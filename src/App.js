
// src/App.js
import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Todo from "./pages/TodoApp";
localStorage.removeItem("token");

function App() {
    const location = useLocation();
    const token = localStorage.getItem("token");

    return (
        <Routes>
            <Route path="/" element={<Navigate to={token ? "/todo" : "/login"} />} />
            <Route path="/login" element={!token ? <Login /> : <Navigate to="/todo" replace />} />
            <Route path="/register" element={!token ? <Register onRegister={() => window.location.href = "/login"} /> : <Navigate to="/todo" replace />} />
            <Route path="/todo" element={token ? <Todo /> : <Navigate to="/login" replace />} />
        </Routes>
    );
}

export default App;
