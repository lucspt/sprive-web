const TaskRow = ({ task, nav, fetcher }) => {
  const edit = () => nav("configure", {state: {method: "PUT", task: task}});
  const { status } = task;
  const deleteTask = () => {
    fetcher.submit({taskId: task._id}, { method: "DELETE", action: "/saviors/tasks" });
  }
  const complete = status === "complete"
  const markComplete = () => {
    if (complete) return;
    fetcher.submit({taskId: task._id}, { method: "PATCH", action: "/saviors/tasks" });
  }
  const { description } = task;
  return (
    <div className="row thin">
      <span>{task.name}</span>
      <button className={`status ${status} default-btn`} 
        onClick={markComplete}
      >
        {status}
      </button>
      <span>{task.assignees}</span>
      <span className="line-clamp">{description}</span>
    <div className="align-end">
      {
        !complete && 
        <>
        <button onClick={markComplete}>
            <span className="material-symbols-rounded pink-hov">done</span>
          </button>
          <button onClick={edit}>
            <span className="material-symbols-rounded pink-hov" >edit</span>
          </button>
        </>
        }
        <button style={{marginLeft: 8}} onClick={deleteTask}>
          <span 
            className="material-symbols-rounded pink-hov" 
            >
            delete
          </span>
        </button>
      </div>
    </div>
  )
} 

export default TaskRow