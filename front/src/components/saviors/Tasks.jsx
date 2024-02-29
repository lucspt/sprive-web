import DataTable from "../DataTable"
import { useEffect,  memo, useContext } from "react"
import { fetchData, isObjectEmpty } from "../../utils"
import { redirect, useFetcher, useLocation, useNavigate } from "react-router-dom"
import { SaviorContext } from "../../contexts/SaviorContext"

// who knew a todolist could be so much

export const configureTask = async ({ request }) => {
  console.log("ACTION")
  let req = await request.formData()
  req = Object.fromEntries(req)
  let taskId;
  const { method } = request
  method === "PUT" ? taskId = `/${req._id}` : taskId = ""
  const response = await fetchData(`saviors/tasks${taskId}`, method, req)
  if (response.ok) {
    return redirect("../tasks")
  } else {
    throw new Error("that didn't work out")
  }
} 

export const taskActions = async ({ request }) => {
  try {
    let taskId = await request.formData()
    taskId = taskId.get("taskId")
    const response = await fetchData(`saviors/tasks/${taskId}`, request.method)
    if (response.ok) {
      return redirect(".")
    } else {
      throw new Error("that didn't work out")
    }
  } catch (e) {
    console.log(e)
    return null
  }
}

const TasksList = memo(() => {
  const { tasks, getTasks } = useContext(SaviorContext)
  const fetcher = useFetcher()
  const nav = useNavigate()

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

const TaskRow = ({ task, nav, fetcher }) => {
  const dearBestFriends = ["godin", "bodhi", "eart", "univ", "tangib", "soune", "moune", "liv", "stark", "stav", "stan", "soule", "luca", "hart"]
  const edit = () => nav("configure", {state: {method: "PUT", task: task}})
  const { status } = task
  const deleteTask = () => {
    fetcher.submit({taskId: task._id}, { method: "DELETE", action: "/saviors/tasks" })
  }
  const complete = status === "complete"
  const markComplete = () => {
    if (complete) return;
    fetcher.submit({taskId: task._id}, { method: "PATCH", action: "/saviors/tasks" })
  }
  const { description } = task
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

export default TasksList

export const TaskConfigurater = memo(function TaskCreator() {
  const { state: { method, task } } = useLocation()
  const { tasks: { tasks, pending }, getTasks } = useContext(SaviorContext)
  const fetcher = useFetcher()

  useEffect(() => {
    if (isObjectEmpty(tasks)) getTasks();
  }, [])

  return (
    <div className="sidebar-grid">
      <div className="tasks sidebar">
        <header>
          <h3>current tasks</h3>
          <span>total: {tasks?.length}</span>
          {
            tasks?.length > 0 &&
            <span>in progress: {pending}</span>
          }
        </header>
        <div className="tasks-ul">
          {tasks && tasks.map(t => (
            <div className="item" key={t._id}>
              <div className="task-card">
                <span>{t.name}</span>
                <span className={`status ${t.status}`}>{t.status}</span>
              </div>
              <span className="description">{t.description}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="tasks main-content">
        <fetcher.Form method={method} action=".">
          <div className="top" style={{display: "flex", justifyContent: "space-evenly",}}>
            <div className="field">
              <label htmlFor="name" >task name</label>
              <input 
                autoComplete="off" 
                type="text"
                name="name"
                id="name"
                className="rounded-input"
                defaultValue={task?.name || ""}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="category" >category</label>
              <input 
                autoComplete="off" 
                type="text"
                name="category"
                id="category"
                className="rounded-input"
                defaultValue={task?.category || ""}
                required
              />
            </div>
          </div>
          <div className="field large">
              <label htmlFor="assignees" >assignees</label>
              <input 
                autoComplete="off" 
                type="text"
                name="assignees"
                id="assignees"
                className="rounded-input"
                defaultValue={task?.assignees || ""}
              />
            </div>
          <div className="field large">
            <label htmlFor="description" >description</label>
            <textarea 
              name="description" 
              id="description"
              className="rounded-input" 
              defaultValue={task?.description || ""}
              rows={6}
              style={{ 
                backgroundColor: "var(--soft-white)", 
                color: "var(--black)", 
                height: "unset" 
              }}
            />
          </div>
          <input type="hidden" value={task?._id} name="_id" id="_id"/>
          <button type="submit" className="default-btn">submit</button>
        </fetcher.Form>
      </div>
    </div>
  )
})