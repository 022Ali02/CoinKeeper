import axios from 'axios';

const API_BASE_URL = "http://localhost:8080"; // backend todo
const AUTH_API_URL = "http://localhost:8085/auth"; // backend auth

// 📦 Axios interceptor: добавляем токен авторизации
axios.interceptors.request.use((config) => {
    const token = sessionStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

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

// --- TODO SERVICE ---

export const getTasks = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/tasks`);
        return response.data;
    } catch (error) {
        console.error("Ошибка при загрузке задач:", error);
        return [];
    }
};

export const addTask = async (task) => {
    try {
        await axios.post(`${API_BASE_URL}/tasks`, task, {
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        console.error("Ошибка при добавлении задачи:", error);
    }
};

export const deleteTask = async (taskId) => {
    try {
        await axios.delete(`${API_BASE_URL}/tasks/${taskId}`);
    } catch (error) {
        console.error("Ошибка при удалении задачи:", error);
    }
};

export const updateTask = async (id, task) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/tasks/${id}`, task, {
            headers: { "Content-Type": "application/json" }
        });
        return response.data;
    } catch (error) {
        console.error("Ошибка при обновлении задачи:", error);
        return null;
    }
};
