import axios from "axios";

const API_BASE_URL = "http://localhost:8085";  // Пример для работы с транзакциями и категориями
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
// Логин
export const login = async (credentials) => {
    try {
        const response = await axios.post(`${AUTH_API_URL}/login`, credentials);
        const token = response.data.token;
        localStorage.setItem("token", token); // Сохраняем токен в localStorage
        return token;
    } catch (error) {
        console.error("Ошибка при входе:", error);
        throw error;
    }
};

// Регистрация
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
        throw error;
    }
};

// --- CATEGORY SERVICE ---
// Получение категорий
export const getCategories = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/categories`);
        return response.data;
    } catch (error) {
        console.error("Ошибка при загрузке категорий:", error);
        return [];
    }
};

// Добавление категории
export const addCategory = async (category) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/categories`, { name: category });
        return response.data;
    } catch (error) {
        console.error("Ошибка при добавлении категории:", error);
        throw error;
    }
};

// Обновление категории
export const updateCategory = async (categoryId, updatedCategory) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/categories/${categoryId}`, updatedCategory);
        return response.data;
    } catch (error) {
        console.error("Ошибка при обновлении категории:", error);
        throw error;
    }
};

// Удаление категории
export const deleteCategory = async (categoryId) => {
    try {
        await axios.delete(`${API_BASE_URL}/categories/${categoryId}`);
    } catch (error) {
        console.error("Ошибка при удалении категории:", error);
        throw error;
    }
};
