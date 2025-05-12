import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Importing useNavigate hook
import "../styles/Settings.css"; // Импортируем стили

const Settings = () => {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState(""); // For adding a new category
    const [newColor, setNewColor] = useState("#000000"); // For selecting a new category color
    const [isEditing, setIsEditing] = useState(false); // For editing category
    const [categoryToEdit, setCategoryToEdit] = useState({ id: "", name: "", color: "" }); // Category to be edited

    const navigate = useNavigate(); // Initialize navigate hook

    useEffect(() => {
        const savedCategories = JSON.parse(localStorage.getItem("categories")) || [];
        setCategories(savedCategories); // Update category list
    }, []);

    const handleAddCategory = (e) => {
        e.preventDefault();
        if (newCategory.trim()) {
            const newCategoryObj = { id: Date.now(), name: newCategory, color: newColor }; // Create category object with color
            const updatedCategories = [...categories, newCategoryObj]; // Add new category to list
            localStorage.setItem("categories", JSON.stringify(updatedCategories)); // Save to localStorage
            setCategories(updatedCategories); // Update state
            setNewCategory(""); // Clear input after adding
            setNewColor("#000000"); // Reset color
        }
    };

    const handleEditCategory = (e) => {
        e.preventDefault();
        if (categoryToEdit.name.trim()) {
            const updatedCategories = categories.map((category) =>
                category.id === categoryToEdit.id ? { ...category, name: categoryToEdit.name, color: categoryToEdit.color } : category
            );
            localStorage.setItem("categories", JSON.stringify(updatedCategories)); // Save updated categories
            setCategories(updatedCategories); // Update state
            setIsEditing(false); // Close edit mode
            setCategoryToEdit({ id: "", name: "", color: "" }); // Clear edit fields
        }
    };

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
        <div className="settings-container">
            <h1 className="settings-heading">Настройки категорий</h1>

            {/* Button to go back to Dashboard */}
            <button className="back-button" onClick={handleGoToDashboard}>Назад</button>

            {/* Form to add new category */}
            <form onSubmit={handleAddCategory} className="category-form">
                <input
                    type="text"
                    placeholder="Новая категория"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="input-field"
                />
                <input
                    type="color"
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    className="color-picker"
                />
                <button type="submit" className="submit-button">
                    Добавить категорию
                </button>
            </form>

            {/* List of Categories */}
            <div className="categories-list">
                <h2>Список категорий</h2>
                <ul className="category-list">
                    {categories.length === 0 ? (
                        <p className="no-categories">Нет категорий</p>
                    ) : (
                        categories.map((category) => (
                            <li key={category.id} className="category-item">
                                <span className="category-name" style={{ color: category.color }}>
                                    {category.name}
                                </span>
                                <div className="category-buttons">
                                    <button
                                        className="edit-button"
                                        onClick={() => {
                                            setIsEditing(true);
                                            setCategoryToEdit(category); // Pass category object for editing
                                        }}
                                    >
                                        Редактировать
                                    </button>
                                    <button
                                        className="delete-button"
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

            {/* Edit Category Form (Modal style) */}
            {isEditing && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Редактировать категорию</h2>
                        <form onSubmit={handleEditCategory}>
                            <input
                                type="text"
                                value={categoryToEdit.name}
                                onChange={(e) => setCategoryToEdit({ ...categoryToEdit, name: e.target.value })}
                                className="input-field"
                            />
                            <input
                                type="color"
                                value={categoryToEdit.color}
                                onChange={(e) => setCategoryToEdit({ ...categoryToEdit, color: e.target.value })}
                                className="color-picker"
                            />
                            <button type="submit" className="submit-button">
                                Сохранить изменения
                            </button>
                        </form>
                        <button className="close-button" onClick={() => setIsEditing(false)}>
                            Закрыть
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Settings;
