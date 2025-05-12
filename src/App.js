// src/App.js
import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Stats from "./pages/Stats";
import Settings from "./pages/Settings";
import './styles/Dashboard.css';
import './styles/Settings.css';

function App() {
    const location = useLocation();
    const token = localStorage.getItem("token");

    return (
        <Routes>
            <Route path="/" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
            <Route path="/login" element={!token ? <Login /> : <Navigate to="/dashboard" replace />} />
            <Route path="/register" element={!token ? <Register /> : <Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" replace />} />
            <Route path="/stats" element={token ? <Stats /> : <Navigate to="/login" replace />} />
            <Route path="/settings" element={token ? <Settings /> : <Navigate to="/login" replace />} />
        </Routes>
    );
}

export default App;
