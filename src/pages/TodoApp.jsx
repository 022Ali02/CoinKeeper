import React, { useEffect, useState } from "react";
import { getTasks, addTask, deleteTask, updateTask } from "../api";
import { useNavigate } from "react-router-dom";
import {
    Button,
    TextField,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Paper,
    Typography
} from "@mui/material";
import { Delete, Edit, Done, Close } from "@mui/icons-material";

function TodoApp() {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState("");
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [editedTitle, setEditedTitle] = useState("");

    const navigate = useNavigate();

    // 🔐 Логаут
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        const data = await getTasks();
        setTasks(data);
    };

    const handleAddTask = async () => {
        if (newTask.trim()) {
            const newTaskObj = { title: newTask, description: "", completed: false, status: "Назначено" };
            await addTask(newTaskObj);
            loadTasks();
            setNewTask("");
        }
    };

    const handleDeleteTask = async (id) => {
        await deleteTask(id);
        loadTasks();
    };

    const handleEditTask = (task) => {
        setEditingTaskId(task.id);
        setEditedTitle(task.title);
    };

    const handleSaveTask = async (id) => {
        const updatedTask = { ...tasks.find(t => t.id === id), title: editedTitle };
        await updateTask(id, updatedTask);
        loadTasks();
        setEditingTaskId(null);
    };

    const handleStatusChange = async (task) => {
        try {
            const updatedStatus = task.status === "В процессе" ? "Завершено" : "В процессе";
            const updatedTask = { ...task, status: updatedStatus };
            await updateTask(task.id, updatedTask);
            loadTasks();
        } catch (error) {
            console.error("Ошибка при обновлении статуса:", error);
        }
    };

    return (
        <div style={{ padding: "20px", fontFamily: "Arial", maxWidth: "600px", margin: "auto" }}>
            <Typography variant="h4" gutterBottom style={{ textAlign: "center" }}>📌 Список задач</Typography>

            <div style={{ textAlign: "right", marginBottom: "10px" }}>
                <Button variant="outlined" color="error" onClick={handleLogout}>
                    Выйти
                </Button>
            </div>

            <Paper style={{ padding: "15px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                <TextField
                    label="Добавить задачу..."
                    variant="outlined"
                    fullWidth
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                />
                <Button variant="contained" color="primary" onClick={handleAddTask}>Добавить</Button>
            </Paper>

            <List>
                {tasks.map((task) => (
                    <Paper key={task.id} style={{ marginBottom: "10px", padding: "10px" }}>
                        <ListItem style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            {editingTaskId === task.id ? (
                                <>
                                    <TextField
                                        variant="outlined"
                                        value={editedTitle}
                                        onChange={(e) => setEditedTitle(e.target.value)}
                                        fullWidth
                                    />
                                    <IconButton color="success" onClick={() => handleSaveTask(task.id)}>
                                        <Done />
                                    </IconButton>
                                </>
                            ) : (
                                <>
                                    <ListItemText primary={task.title} secondary={task.status} />
                                    <IconButton
                                        color={task.status === "Завершено" ? "success" : "warning"}
                                        onClick={() => handleStatusChange(task)}
                                    >
                                        {task.status === "Завершено" ? <Done /> : <Close />}
                                    </IconButton>
                                    <IconButton color="primary" onClick={() => handleEditTask(task)}>
                                        <Edit />
                                    </IconButton>
                                    <IconButton color="error" onClick={() => handleDeleteTask(task.id)}>
                                        <Delete />
                                    </IconButton>
                                </>
                            )}
                        </ListItem>
                    </Paper>
                ))}
            </List>
        </div>
    );
}

export default TodoApp;
