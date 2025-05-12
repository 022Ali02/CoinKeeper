// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api";

function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login({ username, password });
            navigate("/todo");
        } catch (error) {
            alert("Ошибка входа");
        }
    };

    const handleGoToRegister = () => {
        navigate("/register");
    };

    return (
        <div style={{ textAlign: "center", marginTop: "100px" }}>
            <h2>Вход</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Логин"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                /><br />
                <input
                    type="password"
                    placeholder="Пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                /><br />
                <button type="submit">Войти</button>
            </form>
            <br />
            <button onClick={handleGoToRegister}>Регистрация</button>
        </div>
    );
}

export default Login;
