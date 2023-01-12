const TaskForm = ({createTask, name, handlerInputChange, isEditing, updateTask}) => {
    return (
    <form className="task-form" onSubmit={isEditing ? updateTask : createTask}>
        <input type="text" placeholder="Add a Task" name="name" value={name} onChange={handlerInputChange}/>
            <button type="submit">{isEditing ? "Edit" : "Add"}</button>
        </form>
        )
};

export default TaskForm;
