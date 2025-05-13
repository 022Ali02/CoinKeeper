import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Settings.css";
import { Link } from "react-router-dom";

const Settings = () => {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState("");
    const [newColor, setNewColor] = useState("#000000");
    const [isEditing, setIsEditing] = useState(false);
    const [categoryToEdit, setCategoryToEdit] = useState({ id: "", name: "", color: "" });

    const navigate = useNavigate();

    useEffect(() => {
        const savedCategories = JSON.parse(localStorage.getItem("categories")) || [];
        setCategories(savedCategories);
    }, []);

    const handleAddCategory = (e) => {
        e.preventDefault();
        if (newCategory.trim()) {
            const newCategoryObj = { id: Date.now(), name: newCategory, color: newColor };
            const updatedCategories = [...categories, newCategoryObj];
            localStorage.setItem("categories", JSON.stringify(updatedCategories));
            setCategories(updatedCategories);
            setNewCategory("");
            setNewColor("#000000");
        }
    };

    const handleEditCategory = (e) => {
        e.preventDefault();
        if (categoryToEdit.name.trim()) {
            const updatedCategories = categories.map((category) =>
                category.id === categoryToEdit.id ? { ...category, name: categoryToEdit.name, color: categoryToEdit.color } : category
            );
            localStorage.setItem("categories", JSON.stringify(updatedCategories));
            setCategories(updatedCategories);
            setIsEditing(false);
            setCategoryToEdit({ id: "", name: "", color: "" });
        }
    };

    const handleDeleteCategory = (categoryId) => {
        const updatedCategories = categories.filter((category) => category.id !== categoryId);
        localStorage.setItem("categories", JSON.stringify(updatedCategories));
        setCategories(updatedCategories);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("transactions");
        window.location.href = "/login";
    };

    return (
        <div className="min-h-screen bg-black text-white p-6">
            {/* Navbar - same as Dashboard */}
            <div className="navbar">
                <div className="navbar-left">
                    <Link to="/dashboard" className="active">Dashboard</Link>
                </div>
                <div className="navbar-right">
                    <Link to="/settings">Настройки</Link>
                    <a href="/login" onClick={handleLogout}>Выйти</a>
                </div>
            </div>


            <div className="settings-container">
                <h1 className="settings-heading">Настройки категорий</h1>

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
                                    <span className="category-name" style={{color: category.color}}>
                                        {category.name}
                                    </span>
                                    <div className="category-buttons">
                                        <button
                                            className="edit-button"
                                            onClick={() => {
                                                setIsEditing(true);
                                                setCategoryToEdit(category);
                                            }}
                                        >
                                            Редактировать
                                        </button>
                                        <button
                                            className="delete-button"
                                            onClick={() => handleDeleteCategory(category.id)}
                                        >
                                            Удалить
                                        </button>
                                    </div>
                                </li>
                            ))
                        )}
                    </ul>
                </div>

                {/* Edit Category Form */}
                {isEditing && (
                    <div className="modal-overlay" onClick={() => setIsEditing(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <h2>Редактировать категорию</h2>
                            <form onSubmit={handleEditCategory}>
                                <input
                                    type="text"
                                    value={categoryToEdit.name}
                                    onChange={(e) => setCategoryToEdit({...categoryToEdit, name: e.target.value})}
                                    className="input-field"
                                />
                                <input
                                    type="color"
                                    value={categoryToEdit.color}
                                    onChange={(e) => setCategoryToEdit({...categoryToEdit, color: e.target.value})}
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
        </div>
    );
};

export default Settings;