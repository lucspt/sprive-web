import { memo, useContext, useEffect, useRef, useState } from "react";
import { Form, useLocation, Link, useNavigate } from "react-router-dom";
import { windowSize } from "../../utils";
import { SaviorContext } from "../../contexts/SaviorContext";
import "./DashboardRouter.css"

const saviorSections = {
  "partners": ["suppliers", "products",],
  "users": []
}

const DashboardRouter = memo(function DashboardRouter({ currentSection }) {
  
  const hideBanner = useRef(false);
  const form = useRef();
  const nav = useNavigate();
  
  const { savior, getTasks, tasks } = useContext(SaviorContext);
  const loc = useLocation();

  useEffect(() => {
    if (!hideBanner.current) {
      hideBanner.current = true;
    }
  }, [])

  useEffect(() => {
    getTasks();
  }, [])
  
  const sections = saviorSections[savior.savior_type];
  const { pending } = tasks;
  return (
    <div 
      className={`dashboard-sections ${windowSize}${loc.pathname.includes("overview") ? "" : " compact"}`} 
      method="GET" 
      ref={form}
    >
      <div className="heading">
        <header>
          <h3 style={{fontSize: "1.37em"}}>Back to protecting, {savior.username}</h3>
        </header>
        <Link to="../tasks">{pending} {pending === 1 ?  "task" : "tasks"} awaiting completion</Link>
      </div>
      <div className="buttons">
        <SectionBtn section="overview" currentSection={currentSection} nav={nav}
         />
        <SectionBtn section="emissions" currentSection={currentSection} nav={nav}
         />
        <SectionBtn section="pledges" currentSection={currentSection} nav={nav}
         />
        {
          sections?.map(section => (
            <SectionBtn 
              section={section} 
              key={section} 
              nav={nav} 
              loc={loc}
            />
          ))
        }
      </div>
    </div>
  )
}) 

const SectionBtn = ({ section, currentSection, nav }) => {
  const isDisabled = currentSection === section
  return (
    <button 
      key={section}
      value={section}
      aria-disabled={isDisabled}
      disabled={isDisabled}
      onClick={() => nav(`/saviors/${section}`)}
      className={
        `section${isDisabled ? " active" : ""}`
      }
    >
      {section}
    </button>
  )
}

export default DashboardRouter