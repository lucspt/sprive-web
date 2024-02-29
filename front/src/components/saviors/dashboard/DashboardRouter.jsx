import { memo, useContext, useEffect, useRef } from "react";
import { Form, useLocation, Link } from "react-router-dom";
import { windowSize } from "../../../utils";
import { SaviorContext } from "../../../contexts/SaviorContext";

const saviorSections = {
  "partners": ["suppliers", "products",],
  "users": []
}

const SectionBtn = ({ section, currentSection, loc }) => {
  const isDisabled = loc?.search?.includes(section)  
  return (
    <button 
      type="submit"
      name="section"
      key={section}
      value={section}
      aria-disabled={isDisabled}
      disabled={isDisabled}
      className={
        `section${currentSection == section ? " active" : ""}`
      }
    >
      {section}
    </button>
  )
}
const DashboardRouter = memo(function DashboardRouter({ currentSection }) {
  
  const hideBanner = useRef(false)
  const form = useRef()
  
  const { savior, getTasks, tasks } = useContext(SaviorContext)
  const loc = useLocation()

  useEffect(() => {
    if (!hideBanner.current) {
      hideBanner.current = true
    }
  }, [])

  useEffect(() => {
    getTasks()
  }, [])
  
  const sections = saviorSections[savior.savior_type]
  const { pending } = tasks
  return (
    <Form 
      className={`dashboard-sections ${windowSize}${loc.search.includes("overview") ? "" : " compact"}`} 
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
        <SectionBtn section="overview" currentSection={currentSection} loc={loc} />
        <SectionBtn section="emissions" currentSection={currentSection} loc={loc} />
        <SectionBtn section="pledges" currentSection={currentSection} loc={loc} />
        {
          sections?.map(section => (
            <SectionBtn section={section} key={section} currentSection={currentSection}/>
          ))
        }
      </div>
    </Form>
  )
}) 

export default DashboardRouter