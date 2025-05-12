import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createTransaction } from "../store/slices/transactionSlice";

const AddTransactionModal = ({ onClose }) => {
    const dispatch = useDispatch();
    const [form, setForm] = useState({
        type: "expense",
        amount: "",
        category: "",
        comment: "",
        date: new Date().toISOString().split("T")[0],
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const transaction = { ...form, amount: parseFloat(form.amount), username: "admin" };
        dispatch(createTransaction(transaction));
        onClose(); // закрыть модалку
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white text-black p-6 rounded-xl w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">Добавить транзакцию</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <select name="type" value={form.type} onChange={handleChange} className="w-full p-2 border rounded">
                        <option value="income">Доход</option>
                        <option value="expense">Расход</option>
                    </select>
                    <input type="number" name="amount" placeholder="Сумма" required value={form.amount}
                           onChange={handleChange} className="w-full p-2 border rounded" />
                    <input type="text" name="category" placeholder="Категория" required value={form.category}
                           onChange={handleChange} className="w-full p-2 border rounded" />
                    <input type="text" name="comment" placeholder="Комментарий (необязательно)"
                           value={form.comment} onChange={handleChange} className="w-full p-2 border rounded" />
                    <input type="date" name="date" value={form.date} onChange={handleChange}
                           className="w-full p-2 border rounded" />
                    <div className="flex justify-end space-x-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Отмена</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Сохранить</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddTransactionModal;
