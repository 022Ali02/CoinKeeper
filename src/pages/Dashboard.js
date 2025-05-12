import React, { useState, useEffect } from "react";
import { getTransactions, addTransaction } from "../api";
import { useNavigate } from "react-router-dom"; // Импортируем useNavigate для навигации
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Регистрируем компоненты для Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
    const [transactions, setTransactions] = useState([]);
    const [categories, setCategories] = useState([]); // Состояние для категорий
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTransaction, setNewTransaction] = useState({
        type: "expense", // Стандартно ставим расход
        amount: "",
        category: "",
        comment: "",
        date: "",
        username: "admin", // Имя пользователя
    });

    const navigate = useNavigate(); // Хук для навигации

    // Загружаем транзакции из localStorage при монтировании компонента
    useEffect(() => {
        const savedTransactions = JSON.parse(localStorage.getItem("transactions")) || []; // Если нет, то пустой массив
        setTransactions(savedTransactions);

        const savedCategories = JSON.parse(localStorage.getItem("categories")) || [];
        setCategories(savedCategories);
    }, []);

    const balance = transactions.reduce(
        (acc, tx) => (tx.type === "income" ? acc + tx.amount : acc - tx.amount),
        0
    );

    const incomeTotal = transactions
        .filter((tx) => tx.type === "income")
        .reduce((acc, tx) => acc + tx.amount, 0);

    const expenseTotal = transactions
        .filter((tx) => tx.type === "expense")
        .reduce((acc, tx) => acc + tx.amount, 0);

    const chartData = {
        labels: ["Доходы", "Расходы"],
        datasets: [
            {
                data: [incomeTotal, expenseTotal], // Доходы и расходы
                backgroundColor: ["#36A2EB", "#FF6384"], // Цвета секторов
                hoverBackgroundColor: ["#36A2EB", "#FF6384"],
            },
        ],
    };

    // Обработчик добавления транзакции
    const handleAddTransaction = async (e) => {
        e.preventDefault();
        try {
            const response = await addTransaction(newTransaction); // Добавляем транзакцию
            const updatedTransactions = [...transactions, response]; // Обновляем список транзакций
            setTransactions(updatedTransactions); // Обновляем состояние

            // Сохраняем обновленные транзакции в localStorage
            localStorage.setItem("transactions", JSON.stringify(updatedTransactions));

            setIsModalOpen(false); // Закрываем модальное окно
            setNewTransaction({
                type: "expense",
                amount: "",
                category: "",
                comment: "",
                date: "",
                username: "admin",
            });
        } catch (error) {
            console.error("Ошибка при добавлении транзакции:", error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("transactions"); // Очистить транзакции из localStorage
        window.location.href = "/login"; // Перенаправляем на страницу логина
    };

    // Добавляем кнопку для перехода в Settings
    const handleGoToSettings = () => {
        navigate("/settings"); // Переход на страницу настроек
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <h1 className="text-3xl font-bold mb-6">💰 Dashboard</h1>

            <div className="bg-gray-800 p-4 rounded-lg shadow-lg flex justify-between items-center">
                <div>
                    <p className="text-lg">Текущий баланс:</p>
                    <p className="text-2xl font-bold text-green-400">${balance.toFixed(2)}</p>
                </div>
                <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition"
                    onClick={() => setIsModalOpen(true)}
                >
                    ➕ Добавить транзакцию
                </button>
                <button
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl transition"
                    onClick={handleLogout} // Кнопка выхода
                >
                    🚪 Выйти
                </button>
                {/* Кнопка для перехода в настройки */}
                <button
                    className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-xl transition"
                    onClick={handleGoToSettings}
                >
                    ⚙️ Настройки
                </button>
            </div>

            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h2 className="text-xl font-semibold mb-4">Добавить транзакцию</h2>
                        <form onSubmit={handleAddTransaction}>
                            <select
                                value={newTransaction.type}
                                onChange={(e) =>
                                    setNewTransaction({ ...newTransaction, type: e.target.value })
                                }
                                className="mb-3"
                            >
                                <option value="expense">Расход</option>
                                <option value="income">Доход</option>
                            </select>

                            <input
                                type="number"
                                placeholder="Сумма"
                                value={newTransaction.amount}
                                onChange={(e) =>
                                    setNewTransaction({ ...newTransaction, amount: e.target.value })
                                }
                            />
                            {/* Дропдаун для выбора категории */}
                            <select
                                value={newTransaction.category}
                                onChange={(e) =>
                                    setNewTransaction({ ...newTransaction, category: e.target.value })
                                }
                                className="mb-3"
                            >
                                <option value="">Выберите категорию</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.name}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                            <input
                                type="text"
                                placeholder="Комментарий"
                                value={newTransaction.comment}
                                onChange={(e) =>
                                    setNewTransaction({
                                        ...newTransaction,
                                        comment: e.target.value,
                                    })
                                }
                            />
                            <input
                                type="date"
                                value={newTransaction.date}
                                onChange={(e) =>
                                    setNewTransaction({ ...newTransaction, date: e.target.value })
                                }
                            />
                            <button type="submit">Добавить</button>
                        </form>
                        <button onClick={() => setIsModalOpen(false)}>Закрыть</button>
                    </div>
                </div>
            )}

            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Последние транзакции</h2>
                {transactions.length === 0 ? (
                    <p>Нет транзакций</p>
                ) : (
                    <ul>
                        {transactions.map((tx) => (
                            <li key={tx.id}>
                                {tx.type === "income" ? "+" : "-"} {tx.amount} {tx.category}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Круговая диаграмма */}
            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Статистика по транзакциям</h2>
                <Pie data={chartData} />
            </div>
        </div>
    );
};

export default Dashboard;
