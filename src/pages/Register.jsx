import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../api";
import "../styles/Register.css"; // Импортируем стили

function Register() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await register({ username, password });
            alert("Регистрация успешна");
            navigate("/login");
        } catch (error) {
            alert("Ошибка регистрации");
        }
    };

    return (
        <div className="register-container">
            <h1 className="register-heading">Регистрация</h1>
            <form onSubmit={handleRegister} className="register-form">
                <input
                    type="text"
                    placeholder="Логин"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="input-field"
                />
                <input
                    type="password"
                    placeholder="Пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="input-field"
                />
                <button type="submit" className="submit-button">
                    Зарегистрироваться
                </button>
            </form>
            <p className="login-link">
                Уже есть аккаунт?{" "}
                <span onClick={() => navigate("/login")} className="login-text">
                    Войти
                </span>
            </p>
        </div>
    );
}

export default Register;
