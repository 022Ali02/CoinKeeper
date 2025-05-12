import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Importing useNavigate hook
const Settings = () => {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState(""); // For adding a new category
    const [isEditing, setIsEditing] = useState(false); // For editing category
    const [categoryToEdit, setCategoryToEdit] = useState({ id: "", name: "" }); // Category to be edited

    const navigate = useNavigate(); // Initialize navigate hook

    useEffect(() => {
        // Loading categories from localStorage
        const savedCategories = JSON.parse(localStorage.getItem("categories")) || [];
        setCategories(savedCategories); // Update category list
    }, []);

    // Adding category
    const handleAddCategory = (e) => {
        e.preventDefault();
        if (newCategory.trim()) {
            const newCategoryObj = { id: Date.now(), name: newCategory }; // Create category object
            const updatedCategories = [...categories, newCategoryObj]; // Add new category to list
            localStorage.setItem("categories", JSON.stringify(updatedCategories)); // Save to localStorage
            setCategories(updatedCategories); // Update state
            setNewCategory(""); // Clear input after adding
        }
    };

    // Editing category
    const handleEditCategory = (e) => {
        e.preventDefault();
        if (categoryToEdit.name.trim()) {
            const updatedCategories = categories.map((category) =>
                category.id === categoryToEdit.id ? { ...category, name: categoryToEdit.name } : category
            );
            localStorage.setItem("categories", JSON.stringify(updatedCategories)); // Save updated categories
            setCategories(updatedCategories); // Update state
            setIsEditing(false); // Close edit mode
            setCategoryToEdit({ id: "", name: "" }); // Clear edit fields
        }
    };

    // Deleting category
    const handleDeleteCategory = (categoryId) => {
        const updatedCategories = categories.filter((category) => category.id !== categoryId); // Remove deleted category
        localStorage.setItem("categories", JSON.stringify(updatedCategories)); // Save updated categories
        setCategories(updatedCategories); // Update state
    };

    // Handle navigation back to the Dashboard
    const handleGoToDashboard = () => {
        navigate("/dashboard"); // Navigate to the dashboard
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <h1 className="text-3xl font-bold mb-6">Настройки категорий</h1>

            {/* Button to go back to Dashboard */}
            <button
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-xl transition mb-4"
                onClick={handleGoToDashboard}
            >
                Назад
            </button>

            {/* Form to add new category */}
            <form onSubmit={handleAddCategory} className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <input
                    type="text"
                    placeholder="Новая категория"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}  // Update field value
                    className="w-full p-2 bg-gray-700 rounded-md text-white mb-4"
                />
                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl transition"
                >
                    Добавить категорию
                </button>
            </form>

            {/* List of categories */}
            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Список категорий</h2>
                <ul>
                    {categories.length === 0 ? (
                        <p>Нет категорий</p>
                    ) : (
                        categories.map((category) => (
                            <li key={category.id} className="flex justify-between items-center mb-4">
                                <span>{category.name}</span>
                                <div className="flex space-x-2">
                                    <button
                                        className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-xl transition"
                                        onClick={() => {
                                            setIsEditing(true);
                                            setCategoryToEdit(category); // Pass category object for editing
                                        }}
                                    >
                                        Редактировать
                                    </button>
                                    <button
                                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl transition"
                                        onClick={() => handleDeleteCategory(category.id)} // Delete category by id
                                    >
                                        Удалить
                                    </button>
                                </div>
                            </li>
                        ))
                    )}
                </ul>
            </div>

            {/* Form to edit category */}
            {isEditing && (
                <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-4">Редактировать категорию</h2>
                    <form onSubmit={handleEditCategory} className="bg-gray-800 p-6 rounded-lg shadow-lg">
                        <input
                            type="text"
                            value={categoryToEdit.name}
                            onChange={(e) => setCategoryToEdit({ ...categoryToEdit, name: e.target.value })}
                            className="w-full p-2 bg-gray-700 rounded-md text-white mb-4"
                        />
                        <button
                            type="submit"
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl transition"
                        >
                            Сохранить изменения
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Settings;
