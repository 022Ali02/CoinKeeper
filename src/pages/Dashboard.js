import React, { useState, useEffect } from "react";
import { getTransactions, addTransaction } from "../api";
import { useNavigate } from "react-router-dom"; // Importing useNavigate for navigation
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register components for Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
    const [transactions, setTransactions] = useState([]);
    const [categories, setCategories] = useState([]); // State for categories
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTransaction, setNewTransaction] = useState({
        type: "expense", // Default set to expense
        amount: "",
        category: "",
        comment: "",
        date: "",
        username: "admin", // Username
    });

    // Added states for date filters
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const navigate = useNavigate(); // Hook for navigation

    useEffect(() => {
        const savedTransactions = JSON.parse(localStorage.getItem("transactions")) || []; // If not, then an empty array
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

    // Data for the income chart
    const incomeChartData = {
        labels: categories.map((cat) => cat.name), // Category names for labels
        datasets: [
            {
                data: categories.map((cat) =>
                    transactions
                        .filter(
                            (tx) => tx.category === cat.name && tx.type === "income"
                        )
                        .reduce((acc, tx) => acc + tx.amount, 0)
                ),
                backgroundColor: categories.map((cat) => cat.color), // Using category colors
                hoverBackgroundColor: categories.map((cat) => cat.color),
            },
        ],
    };

    // Data for the expense chart
    const expenseChartData = {
        labels: categories.map((cat) => cat.name), // Category names for labels
        datasets: [
            {
                data: categories.map((cat) =>
                    transactions
                        .filter(
                            (tx) => tx.category === cat.name && tx.type === "expense"
                        )
                        .reduce((acc, tx) => acc + tx.amount, 0)
                ),
                backgroundColor: categories.map((cat) => cat.color), // Using category colors
                hoverBackgroundColor: categories.map((cat) => cat.color),
            },
        ],
    };

    // Handle adding a new transaction
    const handleAddTransaction = async (e) => {
        e.preventDefault();
        if (!newTransaction.date) {
            alert("Дата обязательна для добавления транзакции!"); // Validation for date
            return;
        }
        try {
            const response = await addTransaction(newTransaction);
            const updatedTransactions = [...transactions, response]; // Update the transaction list
            setTransactions(updatedTransactions); // Update state

            // Save the updated transactions to localStorage
            localStorage.setItem("transactions", JSON.stringify(updatedTransactions));

            setIsModalOpen(false); // Close the modal
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
        localStorage.removeItem("transactions"); // Clear transactions from localStorage
        window.location.href = "/login"; // Redirect to login page
    };

    const handleGoToSettings = () => {
        navigate("/settings"); // Navigate to settings page
    };

    // Handle date filter
    const filteredTransactions = transactions.filter((tx) => {
        const txDate = new Date(tx.date);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        if (start && txDate < start) return false;
        if (end && txDate > end) return false;

        return true;
    });

    const handleDeleteTransaction = (id) => {
        const updatedTransactions = transactions.filter((tx) => tx.id !== id);
        setTransactions(updatedTransactions);
        localStorage.setItem("transactions", JSON.stringify(updatedTransactions)); // Save to localStorage
    };

    const handleEditTransaction = (id) => {
        const transactionToEdit = transactions.find((tx) => tx.id === id);
        setNewTransaction(transactionToEdit);
        setIsModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-black text-white p-6">
            {/* Navbar */}
            <div className="navbar">
                <div className="navbar-left">
                    <a href="/dashboard" className="active">Dashboard</a>
                </div>
                <div className="navbar-right">
                    <a href="/settings">Настройки</a>
                    <a href="/login" onClick={handleLogout}>Выйти</a>
                </div>
            </div>

            {/* Dashboard Title */}
            <h1>💰 Dashboard</h1>

            {/* Current Balance Section */}
            <div className="current-balance">
                <p>Текущий баланс:</p>
                <p className="amount">${balance.toFixed(2)}</p>
                {/* Add Transaction Button */}
                <div className="add-transaction-container">
                    <button
                        className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-xl transition"
                        onClick={() => setIsModalOpen(true)}
                    >
                        ➕ Добавить транзакцию
                    </button>
                </div>
            </div>

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
            {isModalOpen && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="modal show" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-content">
                            <h2 className="text-xl font-semibold mb-4 text-center">Добавить транзакцию</h2>
                            <form onSubmit={handleAddTransaction}>
                                <select
                                    value={newTransaction.type}
                                    onChange={(e) =>
                                        setNewTransaction({...newTransaction, type: e.target.value})
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
                                        setNewTransaction({...newTransaction, amount: e.target.value})
                                    }
                                />
                                <select
                                    value={newTransaction.category}
                                    onChange={(e) =>
                                        setNewTransaction({...newTransaction, category: e.target.value})
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
                                        setNewTransaction({...newTransaction, date: e.target.value})
                                    }
                                />
                                <button type="submit">Добавить</button>
                            </form>
                            <button className="close" onClick={() => setIsModalOpen(false)}>Закрыть</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Transaction List and Charts */}
            {/* Transaction List and Charts */}
            <div className="transaction-list">
                <h2 className="text-2xl font-bold mb-6">Последние транзакции</h2>
                {transactions.length === 0 ? (
                    <p>Нет транзакций</p>
                ) : (
                    <div className="transaction-cards">
                        {filteredTransactions.map((tx) => (
                            <div className="transaction-card" key={tx.id}>
                                <div className="transaction-info">
                        <span className="amount">
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
