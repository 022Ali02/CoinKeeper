// import React, { useEffect, useState } from "react";
// import { Pie } from "react-chartjs-2";
// import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale } from "chart.js";
//
// // Регистрируем компоненты Chart.js
// ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);
//
// const Stats = ({ transactions }) => {
//     const [chartData, setChartData] = useState({
//         labels: [],
//         datasets: [
//             {
//                 label: "Доходы",
//                 data: [],
//                 backgroundColor: "rgba(0, 255, 0, 0.5)", // Зеленый для доходов
//             },
//             {
//                 label: "Расходы",
//                 data: [],
//                 backgroundColor: "rgba(255, 0, 0, 0.5)", // Красный для расходов
//             },
//         ],
//     });
//
//     useEffect(() => {
//         if (transactions.length > 0) {
//             const categoryData = transactions.reduce((acc, tx) => {
//                 if (!acc[tx.category]) {
//                     acc[tx.category] = { income: 0, expense: 0 };
//                 }
//
//                 if (tx.type === "income") {
//                     acc[tx.category].income += tx.amount;
//                 } else {
//                     acc[tx.category].expense += tx.amount;
//                 }
//                 return acc;
//             }, {});
//
//             const labels = Object.keys(categoryData);
//             const incomeData = labels.map((category) => categoryData[category].income);
//             const expenseData = labels.map((category) => categoryData[category].expense);
//
//             setChartData({
//                 labels,
//                 datasets: [
//                     {
//                         label: "Доходы",
//                         data: incomeData,
//                         backgroundColor: "rgba(0, 255, 0, 0.5)",
//                     },
//                     {
//                         label: "Расходы",
//                         data: expenseData,
//                         backgroundColor: "rgba(255, 0, 0, 0.5)",
//                     },
//                 ],
//             });
//         }
//     }, [transactions]); // Перезапускаем, если данные транзакций изменяются
//     console.log(transactions);
//     return (
//         <div className="bg-gray-900 text-white p-6">
//             <h1 className="text-3xl font-bold mb-6">📊 Статистика</h1>
//             <div className="w-full max-w-xl mx-auto">
//                 <h2 className="text-xl font-semibold mb-4">Доходы и расходы по категориям</h2>
//                 <Pie data={chartData} />
//             </div>
//         </div>
//     );
// };
//
// export default Stats;
