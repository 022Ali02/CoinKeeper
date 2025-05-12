import React, { useState, useEffect } from "react";
import { getTransactions, addTransaction } from "../api";

const Dashboard = () => {
    const [transactions, setTransactions] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTransaction, setNewTransaction] = useState({
        type: "expense", // Стандартно ставим расход
        amount: "",
        category: "",
        comment: "",
        date: "",
        username: "admin", // Имя пользователя
    });

    useEffect(() => {
        // Загружаем транзакции из localStorage, если они там есть
        const savedTransactions = JSON.parse(localStorage.getItem("transactions"));
        if (savedTransactions) {
            setTransactions(savedTransactions);
        }

        // Если нужно, можно загрузить транзакции с сервера:
        // const fetchTransactions = async () => {
        //   try {
        //     const data = await getTransactions();
        //     setTransactions(data);
        //   } catch (error) {
        //     console.error("Ошибка при загрузке транзакций:", error);
        //   }
        // };
        // fetchTransactions();
    }, []);

    const balance = transactions.reduce(
        (acc, tx) => (tx.type === "income" ? acc + tx.amount : acc - tx.amount),
        0
    );

    // Обработчик добавления транзакции
    const handleAddTransaction = async (e) => {
        e.preventDefault();
        try {
            const response = await addTransaction(newTransaction);  // Добавляем транзакцию
            setTransactions([...transactions, response]);  // Обновляем список транзакций
            setIsModalOpen(false);  // Закрываем модальное окно
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

    // Обработчик выхода
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("transactions"); // Очистить транзакции из localStorage
        window.location.href = "/login"; // Перенаправляем на страницу логина
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
                            <input
                                type="text"
                                placeholder="Категория"
                                value={newTransaction.category}
                                onChange={(e) =>
                                    setNewTransaction({
                                        ...newTransaction,
                                        category: e.target.value,
                                    })
                                }
                            />
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
        </div>
    );
};

export default Dashboard;
