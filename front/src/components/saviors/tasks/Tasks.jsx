import DataTable from "../../DataTable"
import { useEffect,  memo, useContext } from "react"
import { fetchData } from "../../../utils"
import { redirect, useFetcher, useNavigate } from "react-router-dom"
import { SaviorContext } from "../../../contexts/SaviorContext"
import TaskRow from "./TaskRow"
import "./Tasks.css"

export const taskActions = async ({ request }) => {
  try {
    let taskId = await request.formData();
    taskId = taskId.get("taskId");
    const response = await fetchData(`saviors/tasks/${taskId}`, request.method);
    if (response.ok) {
      return redirect(".");
    } else {
      throw new Error("that didn't work out");
    }
  } catch (e) {
    console.log(e);
    return null;
  }
}

const TasksList = memo(() => {
  const { tasks, getTasks } = useContext(SaviorContext);
  const fetcher = useFetcher();
  const nav = useNavigate();

  useEffect(() => {
    getTasks();
  }, [fetcher]);

  return (
    <div className="tasks-content">
      <div className="tasks todo-list">
        <div className="tasks-table">
            <DataTable 
              columns={["name", "status", "assignees", "description"]}
              className="tasks"
              >
                {tasks?.tasks?.map(task => <TaskRow key={task._id} task={task} nav={nav} fetcher={fetcher}/>)}
              <button 
                className="default-btn create"
                tabIndex={1}
                onClick={() => nav("configure", {state: {method: "POST"}})}
              >
                create
              </button>
            </DataTable>
        </div>
      </div>
    </div>
  )
})

export default TasksList