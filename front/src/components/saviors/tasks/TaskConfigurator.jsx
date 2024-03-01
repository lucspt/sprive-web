
import { useFetcher, useLocation } from "react-router-dom";
import { useContext, memo, useEffect } from "react";
import { SaviorContext } from "../../../contexts/SaviorContext";
import { isObjectEmpty } from "../../../utils";
import "./TaskConfigurator.css"

export const configureTask = async ({ request }) => {
  let req = await request.formData();
  req = Object.fromEntries(req);
  let taskId;
  const { method } = request;
  method === "PUT" ? taskId = `/${req._id}` : taskId = "";
  const response = await fetchData(`saviors/tasks${taskId}`, method, req);
  if (response.ok) {
    return redirect("../tasks");
  } else {
    throw new Error("that didn't work out");
  }
} 

const TaskConfigurator = memo(function TaskCreator() {
  const { state: { method, task } } = useLocation();
  const { tasks: { tasks, pending }, getTasks } = useContext(SaviorContext);
  const fetcher = useFetcher();

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

export default TaskConfigurator