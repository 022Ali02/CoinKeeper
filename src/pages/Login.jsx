import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../api";
import { loginStart, loginSuccess, loginFailure } from "../store/slices/authSlice";

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
        <div style={{ textAlign: "center", marginTop: "100px" }}>
            <h2>Вход</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Логин"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                /><br />
                <input
                    type="password"
                    placeholder="Пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                /><br />
                <button type="submit" disabled={loading}>
                    {loading ? "Вход..." : "Войти"}
                </button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <br />
            <button onClick={() => navigate("/register")}>Регистрация</button>
        </div>
    );
}

export default Login;
