import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../api";

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
        <div style={{ textAlign: "center", marginTop: "100px" }}>
            <h2>Регистрация</h2>
            <form onSubmit={handleRegister}>
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
                <button type="submit">Зарегистрироваться</button>
            </form>
            <p>Уже есть аккаунт? <span style={{ color: "blue", cursor: "pointer" }} onClick={() => navigate("/login")}>Войти</span></p>
        </div>
    );
}

export default Register;
