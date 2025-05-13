import { addTransaction } from "../api";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";

import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register components for Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
    const [transactions, setTransactions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [newTransaction, setNewTransaction] = useState({
        type: "expense",
        amount: "",
        category: "",
        comment: "",
        date: "",
        username: "admin",
    });

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const savedTransactions = JSON.parse(localStorage.getItem("transactions")) || [];
        setTransactions(savedTransactions);

        const savedCategories = JSON.parse(localStorage.getItem("categories")) || [];
        setCategories(savedCategories);
    }, []);

    const balance = transactions.reduce(
        (acc, tx) => (tx.type === "income" ? acc + tx.amount : acc - tx.amount),
        0
    );

    // Filter transactions based on start and end dates
    const filteredTransactions = transactions.filter((tx) => {
        const txDate = new Date(tx.date);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        if (start && txDate < start) return false;
        if (end && txDate > end) return false;

        return true;
    });

    // Data for the income chart
    const incomeChartData = {
        labels: categories.map((cat) => cat.name),
        datasets: [
            {
                data: categories.map((cat) =>
                    filteredTransactions
                        .filter((tx) => tx.category === cat.name && tx.type === "income")
                        .reduce((acc, tx) => acc + tx.amount, 0)
                ),
                backgroundColor: categories.map((cat) => cat.color),
                hoverBackgroundColor: categories.map((cat) => cat.color),
            },
        ],
    };

    // Data for the expense chart
    const expenseChartData = {
        labels: categories.map((cat) => cat.name),
        datasets: [
            {
                data: categories.map((cat) =>
                    filteredTransactions
                        .filter((tx) => tx.category === cat.name && tx.type === "expense")
                        .reduce((acc, tx) => acc + tx.amount, 0)
                ),
                backgroundColor: categories.map((cat) => cat.color),
                hoverBackgroundColor: categories.map((cat) => cat.color),
            },
        ],
    };

    const handleAddTransaction = async (e) => {
        e.preventDefault();
        if (!newTransaction.date) {
            alert("Дата обязательна для добавления транзакции!");
            return;
        }
        try {
            const response = await addTransaction(newTransaction);
            const updatedTransactions = [...transactions, response]; // Update the transaction list
            setTransactions(updatedTransactions);

            localStorage.setItem("transactions", JSON.stringify(updatedTransactions));

            setIsModalOpen(false);
            setNewTransaction({
                type: "expense",
                amount: "",
                category: "",
                comment: "",
                date: "",
                username: "admin",
            });
        } catch (error) {
            console.error("Error adding transaction:", error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("transactions");
        window.location.href = "/login";
    };

    const handleGoToSettings = () => {
        navigate("/settings");
    };

    const handleDeleteTransaction = (id) => {
        const updatedTransactions = transactions.filter((tx) => tx.id !== id);
        setTransactions(updatedTransactions);
        localStorage.setItem("transactions", JSON.stringify(updatedTransactions));
    };

    const handleEditTransaction = (id) => {
        const transactionToEdit = transactions.find((tx) => tx.id === id);
        setNewTransaction(transactionToEdit);
        setIsModalOpen(true);
        setIsEditMode(true); // Enable edit mode
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setNewTransaction({
            type: "expense",
            amount: "",
            category: "",
            comment: "",
            date: "",
            username: "admin",
        });
        setIsEditMode(false); // Reset edit mode when closing the modal
    };

    const handleModalSubmit = (e) => {
        e.preventDefault();
        if (isEditMode) {
            // Update the existing transaction if in edit mode
            const updatedTransactions = transactions.map((tx) =>
                tx.id === newTransaction.id ? { ...tx, ...newTransaction } : tx
            );
            setTransactions(updatedTransactions);
            localStorage.setItem("transactions", JSON.stringify(updatedTransactions));
        } else {
            // Add a new transaction if not in edit mode
            handleAddTransaction(e);
        }
        setIsModalOpen(false);
    };

    return (
        <div className="min-h-screen bg-black text-white p-6">
            {/* Navbar */}
            <div className="navbar">
                <div className="navbar-left">
                    <a href="/src/pages/Dashboard" className="active">Dashboard</a>
                </div>
                <div className="navbar-right">
                    <a href="/settings">Настройки</a>
                    <a href="/login" onClick={handleLogout}>Выйти</a>
                </div>
            </div>

            <h1>💰Coinkeeper</h1>

            {/* Current Balance Section */}
            <div className="current-balance">
                <p>Текущий баланс:</p>
                <p className="amount">
                    <span className={balance >= 0 ? "text-green-500" : "text-red-500"}>
                        ${balance.toFixed(2)}
                    </span>
                </p>
                <div className="add-transaction-container">
                    <button
                        className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-xl transition"
                        onClick={() => setIsModalOpen(true)}
                    >
                        ➕ Добавить транзакцию
                    </button>
                </div>
            </div>
            {/* Modal for Add/Edit Transaction */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={handleModalClose}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-xl font-semibold mb-4 text-center">
                            {isEditMode ? "Редактировать транзакцию" : "Добавить транзакцию"}
                        </h2>
                        <form onSubmit={handleModalSubmit}>
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
                                type="date"
                                value={newTransaction.date}
                                onChange={(e) =>
                                    setNewTransaction({ ...newTransaction, date: e.target.value })
                                }
                            />
                            <button type="submit">
                                {isEditMode ? "Сохранить изменения" : "Добавить"}
                            </button>
                        </form>
                        <button className="close" onClick={handleModalClose}>
                            Закрыть
                        </button>
                    </div>
                </div>
            )}
            {/* Filter by Date */}
            <div className="filter-section">
                <h2>Фильтровать по датам</h2>
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="bg-gray-700 text-white p-2 rounded-md mb-4"
                />
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="bg-gray-700 text-white p-2 rounded-md mb-4"
                />
            </div>

            {/* Transaction List */}
            <div className="transaction-list">
                <h2 className="text-2xl font-bold mb-6">Последние транзакции</h2>
                {filteredTransactions.length === 0 ? (
                    <p>Нет транзакций</p>
                ) : (
                    <div className="transaction-cards">
                        {filteredTransactions.map((tx) => (
                            <div className="transaction-card" key={tx.id}>
                                <div className="transaction-info">
                                    <span className={`amount ${tx.type === "income" ? "income" : "expense"}`}>
    {tx.type === "income" ? "+" : "-"} {tx.amount}
</span>
                                    <span className="category">{tx.category}</span>
                                    <span className="date">{tx.date}</span>
                                </div>
                                <div className="transaction-actions">
                                    <button onClick={() => handleEditTransaction(tx.id)}>Редактировать</button>
                                    <button onClick={() => handleDeleteTransaction(tx.id)}>Удалить</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Pie Charts */}
            <div className="pie-chart-wrapper">
                <div className="pie-chart-container">
                    <h2 className="text-xl font-semibold mb-4">Доходы</h2>
                    <Pie data={incomeChartData}/>
                </div>

                <div className="pie-chart-container">
                    <h2 className="text-xl font-semibold mb-4">Расходы</h2>
                    <Pie data={expenseChartData}/>
                </div>
            </div>

            <div className="clear"></div>
        </div>
    );
};

export default Dashboard;
