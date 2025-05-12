import axios from "axios";

const API_BASE_URL = "http://localhost:8085";  // Пример для работы с транзакциями
const AUTH_API_URL = "http://localhost:8085/auth";

// 📦 Axios interceptor: добавляем токен авторизации
axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token"); // Получаем токен
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// --- AUTH SERVICE ---
export const login = async (credentials) => {
    try {
        const response = await axios.post(`${AUTH_API_URL}/login`, credentials);
        const token = response.data.token;
        localStorage.setItem("token", token); // 💾 сохраняем токен
        return token;
    } catch (error) {
        console.error("Ошибка при входе:", error);
        throw error;
    }
};

export const register = async (credentials) => {
    try {
        const response = await axios.post(`${AUTH_API_URL}/register`, credentials);
        return response.data;
    } catch (error) {
        console.error("Ошибка при регистрации:", error);
        throw error;
    }
};

// --- TRANSACTION SERVICE ---
// Получение транзакций
export const getTransactions = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/transactions`);
        return response.data;
    } catch (error) {
        console.error("Ошибка при загрузке транзакций:", error);
        return [];
    }
};

// Добавление транзакции
export const addTransaction = async (transaction) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/transactions`, transaction, {
            headers: { "Content-Type": "application/json" },
        });
        return response.data;
    } catch (error) {
        console.error("Ошибка при добавлении транзакции:", error);
    }
};
