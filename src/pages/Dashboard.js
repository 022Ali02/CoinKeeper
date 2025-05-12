import React from "react";

const Dashboard = () => {
    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <h1 className="text-3xl font-bold mb-6">💰 Dashboard</h1>
            <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
                <p className="text-lg">Текущий баланс: <span className="font-semibold">$0.00</span></p>
            </div>

            <div className="mt-6">
                <h2 className="text-xl font-semibold mb-2">Последние транзакции</h2>
                <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
                    <p className="text-gray-400">Здесь появятся транзакции...</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
