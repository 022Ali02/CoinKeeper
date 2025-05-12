import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../api";
import { loginStart, loginSuccess, loginFailure } from "../store/slices/authSlice";
import "../styles/Login.css"; // Импортируем стили

function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const { loading, error } = useSelector((state) => state.auth);

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(loginStart());
        try {
            const token = await login({ username, password });
            dispatch(loginSuccess(token));
            navigate("/dashboard");
        } catch (err) {
            dispatch(loginFailure("Неверный логин или пароль"));
        }
    };

    return (
        <div className="login-container">
            <h1 className="login-heading">Вход</h1>
            <form onSubmit={handleSubmit} className="login-form">
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
                <button type="submit" disabled={loading} className="submit-button">
                    {loading ? "Вход..." : "Войти"}
                </button>
                <button
                    type="button"
                    onClick={() => navigate("/register")}
                    className="register-button"
                >
                    Регистрация
                </button>
            </form>
        </div>
    );
}

export default Login;
