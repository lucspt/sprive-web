import "./DashboardRouter.css"
import DashboardRouterLink from "./DashboardRouterLink"





export default function DashboardRouter({ currentSection }) {


  return (
    <div className="dashboard-router">
      <div className="dashboard-routes">
        <div className="section">
          <div className="section-title">Data</div>
          <DashboardRouterLink to="data/upload" linkText="upload" icon="upload" />
        </div>
        <div className="section">
          <div className="section-title">Dashboard</div>
          <div className="section-routes">
            <DashboardRouterLink to="overview" icon="pie_chart" />
            <DashboardRouterLink to="emissions" icon="co2" />
            <DashboardRouterLink to="products" icon="barcode_scanner" />
            <DashboardRouterLink to="pledges" icon="eco" />
            <DashboardRouterLink to="suppliers" icon="precision_manufacturing" />
          </div>
        </div>
      </div>
    </div>
  )
}


// const DashboardRouter = memo(function DashboardRouter({ currentSection }) {
  
//   const hideBanner = useRef(false);
//   const form = useRef();
//   const nav = useNavigate();
  
//   const { savior, getTasks, tasks } = useContext(SaviorContext);
//   const loc = useLocation();

//   useEffect(() => {
//     if (!hideBanner.current) {
//       hideBanner.current = true;
//     }
//   }, [])

//   useEffect(() => {
//     getTasks();
//   }, [])
  
//   const sections = saviorSections[savior.savior_type];
//   const { pending } = tasks;
//   return (
//     <div 
//       className={`dashboard-sections ${windowSize}${loc.pathname.includes("overview") ? "" : " compact"}`} 
//       method="GET" 
//       ref={form}
//     >
//       <div className="heading">
//         <header>
//           <h3 style={{fontSize: "1.37em"}}>Back to spriving, {savior.username}</h3>
//         </header>
//         <Link to="/saviors/tasks">{pending} {pending === 1 ?  "task" : "tasks"} awaiting completion</Link>
//       </div>
//       <div className="buttons">
//         <SectionBtn section="overview" currentSection={currentSection} nav={nav}
//          />
//         <SectionBtn section="emissions" currentSection={currentSection} nav={nav}
//          />
//         <SectionBtn section="pledges" currentSection={currentSection} nav={nav}
//          />
//         {
//           sections?.map(section => (
//             <SectionBtn 
//               section={section} 
//               currentSection={currentSection}
//               key={section} 
//               nav={nav} 
//               loc={loc}
//             />
//           ))
//         }
//       </div>
//     </div>
//   )
// }) 

// const SectionBtn = ({ section, currentSection, nav }) => {
//   const isDisabled = currentSection === section
//   return (
//     <button 
//       key={section}
//       value={section}
//       aria-disabled={isDisabled}
//       disabled={isDisabled}
//       onClick={() => nav(`/saviors/${section}`)}
//       className={
//         `section${isDisabled ? " active" : ""}`
//       }
//     >
//       {section}
//     </button>
//   )
// }

// export default DashboardRouter