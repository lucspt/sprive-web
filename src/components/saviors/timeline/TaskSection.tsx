import { useNavigate } from "react-router-dom";
import { Header } from "../../header/Header";
import { TaskSectionProps } from "./types";

export default function TaskSection({ 
  section, 
  numCompleted, 
  numIncomplete, 
  warningMessage
 }: TaskSectionProps) {
  // if (numCompleted === undefined || numIncomplete === undefined) return;
  const progressBars = [
    ...Array(numCompleted).fill(true),
    ...Array(numIncomplete).fill(false)
  ];
  const width = `${100 / ((numCompleted || 0) + (numIncomplete || 0))}%` 
  const nav = useNavigate();
  
  return (
    <section className={section}>
      <Header text={section} fontSize="med"/>
      <div className="task-info">
      <div className="progress">
            {
              progressBars.map((isComplete, i) => (
                <div className={`bar ${isComplete ? "complete" : "inactive-opacity"}`}
                  key={i}
                  style={{ width }}
                />
              ))
            }
          </div>
        {numIncomplete === 0 
          ? (
         <p className="section-completed">
          Complete
          <span className="material-symbols-rounded">check</span>
         </p>
          ) : warningMessage && (
            <div className="view-task">
              <p>
                <span className="material-symbols-rounded">report</span>
                { warningMessage }
              </p>
              <button className="default-btn" onClick={() => nav("../tasks")}>View tasks</button>
            </div>
        )
      }
      </div>
    </section>
  )
}