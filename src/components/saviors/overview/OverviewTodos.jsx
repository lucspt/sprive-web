import { memo, useState, useRef, useContext, useEffect } from "react"
import { SaviorContext } from "../../../contexts/SaviorContext"
import { useNavigate } from "react-router-dom"
import "./OverviewTodos.css"

const OverviewTodos = memo(function OverviewTodos({ pendingFiles, showNotice }) {

  const nav = useNavigate();
  const content = useRef();
  const { tasks: { tasks } } = useContext(SaviorContext);
  const [ isVisible, setIsVisible ] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ( [entry] ) => setIsVisible(entry.intersectionRatio),
      { threshold: 0.6 }
    );
    let timeout;
    if (content.current) {
      timeout = setTimeout(() => {
        observer.observe(content.current);
      }, 500)
    }

    return () => {
      observer.disconnect();
      clearTimeout(timeout);
    }
  }, [content])

  let unprocessedFiles = pendingFiles?.length;
  return (
    <div className="widget-spacing todo-list" id="tasks">
      {(!isVisible && unprocessedFiles > 0 && showNotice) && 
        <div className="pending-files" 
        >
          <button onClick={() => content.current.scrollIntoView({behavior: "smooth"})}>
            <span className="material-symbols-rounded" style={{fontSize: 29}}>arrow_downward</span>
          </button>
        </div>
      }
    <span ref={content}></span>
    <div className="content"
    style={{
      transform: isVisible ? "unset" : "translateX(110%)",
      display: "flex",  
      visibility: isVisible ? "visible" : "hidden",
      justifyContent: "center"
    }}
    >
      <div className="todo" id="todos">
          <div className="widget"
            style={{borderRadius: isVisible ? 13 : 0,}}
          > 
            <div className="title">
              <span style={{ fontSize: "1.4em", marginBottom: "20px" }}>tasks</span>
              <button 
                className="white-hov"
                onClick={() => nav("../tasks")}
                style={{cursor: "pointer"}}
              >
                <span className="material-symbols-rounded">open_in_new</span>
              </button>
            </div>
            <div className="labels item">
              <span>task</span>
              <span>status</span>
            </div>
          <div className="list">
            {unprocessedFiles > 0 && 
            <span className="file-notice" onClick={() => nav("../data/tables")}>
              you have  
              {unprocessedFiles > 1 ? ` ${unprocessedFiles} files ` : ` ${unprocessedFiles} file `} 
              awaiting processing
            </span>
            }
            {tasks?.map(task => (
              <div className="item" key={task._id}>
                <span>{task.name}</span>
                <span 
                  className={`indication banner ${task.status} default-btn`}
                >
                  {task.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </div>
  )
})

export default OverviewTodos