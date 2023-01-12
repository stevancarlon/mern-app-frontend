import Task from "./Task";
import TaskForm from "./TaskForm";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { URL } from "../App";
import axios from "axios";
import loadingImg from "../assets/loader.gif";

// http://localhost:5000/api/tasks

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [completedTasks, setCompletedTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [taskId, setTaskId] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        completed: false,
    });

    const { name } = formData;

    const handlerInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const getTasks = async () => {
        setIsLoading(true);
        try {
            const { data } = await axios.get(`${URL}/api/tasks`);
            setTasks(data);
            setIsLoading(false);
        } catch (error) {
            toast.error(error.message);
            console.log(error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getTasks();
    }, []);

    const createTask = async (event) => {
        event.preventDefault();
        if (name === "") {
            return toast.error("Input field cannot be empty");
        }

        try {
            await axios.post(`${URL}/api/tasks`, formData);
            toast.success("Task added successfully");
            setFormData({ ...formData, name: "" });
            getTasks()
        } catch (error) {
            toast.error(error.message);
        }
    };

    const deleteTask = async (id) => {
        try {
            await axios.delete(`${URL}/api/tasks/${id}`);
            getTasks();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const getSingleTask = async (task) => {
        setFormData({ name: task.name, completed: false });
        setTaskId(task._id);
        setIsEditing(true);
    };

    const updateTask = async (event) => {
        event.preventDefault();
        if (name === "") {
            return toast.error("Input field cannot be empty.");
        }
        try {
            await axios.put(`${URL}/api/tasks/${taskId}`, formData);
            setFormData({ ...formData, name: "" });
            setIsEditing(false);
            getTasks();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const setToComplete = async (task) => {
        const newFormData = {
            name: task.name,
            completed: true,
        };

        try {
            await axios.put(`${URL}/api/tasks/${task._id}`, newFormData);
            getTasks();
        } catch (error) {
            toast.error(error.message);
        }
        // console.log(task)
    };

    useEffect(() => {
        const cTask = tasks.filter((task) => {
            return task.completed === true
        })
        setCompletedTasks(cTask)
    }, [tasks])

    return (
        <div>
            <h2>Task Manager</h2>
            <TaskForm
                name={name}
                handlerInputChange={handlerInputChange}
                createTask={createTask}
                isEditing={isEditing}
                updateTask={updateTask}
            />
            {tasks.length > 0 && (
                <div className="--flex-between --pb">
                    <p>Total Tasks: {tasks.length}</p>
                    <p>Completed Tasks: {completedTasks.length}< /p>
                </div>
            )}
            <hr />
            {isLoading && (
                <div className="--flex-center">
                    <img src={loadingImg} alt="" />
                </div>
            )}
            {!isLoading && tasks.length === 0 ? (
                <p className="--py">No tasks found.</p>
            ) : (
                <>
                    {tasks.map((task, index) => {
                        return (
                            <Task
                                key={task._id}
                                task={task}
                                index={index}
                                deleteTask={deleteTask}
                                getSingleTask={getSingleTask}
                                setToComplete={setToComplete}
                            />
                        );
                    })}
                </>
            )}
        </div>
    );
};

export default TaskList;
