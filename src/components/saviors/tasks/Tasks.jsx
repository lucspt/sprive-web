import DataTable from "../../DataTable"
import { useEffect,  memo, useContext } from "react"
import { fetchData } from "../../../utils"
import { redirect, useFetcher, useLoaderData, useNavigate } from "react-router-dom"
import { SaviorContext } from "../../../contexts/SaviorContext"
import TaskRow from "./TaskRow"
import "./Tasks.css"
import TableRow from "../TableRow"

export const taskActions = async ({ request }) => {
  try {
    let taskId = await request.formData();
    taskId = taskId.get("taskId");
    const response = await fetchData(`saviors/tasks/${taskId}`, request.method);
    return redirect(".");
  } catch (e) {
    console.log(e);
    return null;
  }
}

export const tasksLoader = async () => {
  const res = await fetchData("saviors/tasks", "GET");
  return res.content; 
}

const TasksList = memo(() => {
  const fetcher = useFetcher();
  const nav = useNavigate();
  const tasks = useLoaderData();

  useEffect(() => {
    // getTasks();
  }, [fetcher]);

  const tasksTodo = [];
  const tasksComplete = [];

  tasks.tasks.map(x => {
    const { complete } = x;
    if (complete) {
      tasksComplete.push(x);
    } else tasksTodo.push(x);
  });

  return (
    <div className="tasks-content">
      <header>
        <h1>Tasks</h1>
      </header>
      <div className="tasks spacing">
        <div className="tasks-table todo">
            <DataTable 
              columns={["Todo"]}
              className="tasks"
            >
              {tasksTodo?.map(
                task => (
                  <TaskRow 
                    key={task._id}
                    name={task.task} 
                    category={task.category}
                    action="upload" 
                    assignee={task.assignee}
                  />
                )
              )}
            </DataTable>
        </div>
        <div className="tasks-table complete">
          <DataTable
            columns={["Completed"]}
            className="tasks"
          >
            {tasksComplete.map(task => (
              <TaskRow 
                key={task._id}
                name={task.task} 
                category={task.category}
                action="upload" 
                assignee={task.assignee}
              />
            ))
            }
          </DataTable>
        </div>
      </div>
    </div>
  )
})

export default TasksList