import { useEffect, useRef, useState, memo, useContext } from "react";
import { fetchData, formatCO2e, isObjectEmpty, windowSize } from "../../../utils";
import Visualization from "../../Visualization";
import { useNavigate } from "react-router-dom";
import { SaviorContext } from "../../../contexts/SaviorContext";

const CO2eDigit = ({ co2e }) => {
  const [ digit, metric ] = formatCO2e(co2e)

  return (
    <div>
      <span className="info-digit">{digit}</span>
      <span className="info-metric">{metric}/CO2e</span>
    </div>
  )
}

const Overview = memo(function Overview({ content }) {
  const animate = useRef(true)
  const { savior: { savior_type: saviorType } } = useContext(SaviorContext)

  const { emissions, pledges, products } = content

  const randomDelay = () => Math.random() * 0.3
  const barGraphDelay = randomDelay()

  useEffect(() => {animate.current = false}, [])
  const topEmitter = Math.max(...emissions.co2e_per_category.map(x => x.percentage))

  return ( 
    emissions &&  
    <>
      <div className={`widget-spacing${animate.current ? " static" : ""}`}>
        <div className="widgets-grid">
          <div className="widget-row">
          <div 
            className={`info-widget widget slide-in-left`}
            style={{animationDelay: `${randomDelay()}s`}}
          >
            <span className="info-title" style={{"textAlign": "end"}}>total emissions:</span>
            <CO2eDigit co2e={emissions.total_co2e} />
          </div>
          <div className={`info-widget widget slide-up`}>
            <span className="info-title">emissions saved:</span>
            <CO2eDigit co2e={pledges.total_co2e} />
          </div>
          <div className={`info-widget widget slide-in-right end`}
            style={{
                animationDelay: `${randomDelay()}s`,
                justifyContent: "space-evenly",
                flexDirection: "column"
            }}
          >
            <div 
              className="pledge-extras"
              style={{
                justifyContent: "space-between",
                alignItems: "center", 
                flexDirection: saviorType === "partners" ? "row" : "column"
              }}
            >
              <span className="info-title">pledges made: </span>
              <span className="info-digit" style={{fontSize: "1.4em"}}>{pledges.active}</span>
            </div>
            {saviorType === "partners" && 
              <div className="pledge-info">
              <span className="info-title">products published: </span>
              <span className="info-digit" style={{"textAlign": "end", fontSize: "1.4em"}}>{products.length}</span>
            </div>
            }
          </div>
          </div>
          <div className="widget-row" >
          <div className={`widget med slide-in-left`} style={{animationDelay: `${barGraphDelay}s`}}>
            <span style={{justifySelf: "center"}}>emissions by category</span>
            {emissions.co2e_per_category && 
              <div className="widget-ul">
              {emissions.co2e_per_category.map(activity => (
                  <div className="item" key={activity._id}>
                    <span className="indicator">{activity._id}</span>
                    <span className="bar" 
                      style={{
                        maxWidth: ` ${activity.percentage}%`, 
                        animationDelay: `${Math.random() * (0.35 - barGraphDelay) + barGraphDelay + 0.35}s`,
                      }}
                      >
                    </span>
                    <span className="bar-pct">{Math.round(activity.percentage)}%</span>
                  </div>
              ))
              }
            </div>
            }
          </div>
          <div className={`widget med slide-up`}
            style={{
              animationDelay: `${randomDelay()}s`, padding: 20, paddingLeft: 10}}>
                <div className="savior-rating rating B">
                  <span style={{ color: "var(--soft-white)"}}>sprive rating:</span>
                  <div className="medal">
                    <span className={`rating B`}>B</span>
                  </div>
                </div>
          </div>
          <div className={`widget med slide-in-right`}
            style={{"justifySelf": "flex-end", 
                    animationDelay: `${randomDelay()}s`,
                    padding: 20, paddingLeft: 10}}
          >
              <span>CO2e emissions vs pledges</span>
              <OverviewBarChart emissions={emissions.total_co2e} pledges={pledges.total_co2e}/>
          </div>
          </div>
        </div>
      </div>
    <OverviewTodos
      pendingFiles={content.unprocessed_files} 
      showNotice={!animate.current}
    />
  </> 
  )
})

export default Overview

const OverviewBarChart = memo(({ emissions, pledges }) => {

  return emissions && (

  <Visualization
  type="bar"
  id="bar"
  labels={["emissions", "pledges"]}
  datasets={[
    {
      label: "CO2e",
      data: [emissions, pledges],
      borderWidth: 1,
      borderRadius: 10,
      barThickness: 40,
      backgroundColor: ["#27374D", "#1B4242"]
    },
  ]}
  backgroundColor="transparent"
  style={{ maxWidth: "min-content", maxHeight: 235, justifySelf: "center"}}
  options={{
    animation: {
      onComplete: () => {
        delayed: true
      },
      delay: () => {
        return 500;
      }
    },
    scales: {
      x: {
        display: false
      },
      y: {
        display: false
      },
    },
    plugins: {
      legend: {
        display: false,
        // position: "bottom",
        // align: "center",
        // display: "true",
        // labels: {
        //   boxWidth: 20,
        //   boxHeight: 20,
        // }
      }
    },
  }}
  />
)})


export const OverviewTodos = memo(function OverviewTodos({ pendingFiles, showNotice }) {

  const nav = useNavigate()
  const content = useRef()
  const { tasks: { tasks } } = useContext(SaviorContext)
  const [ isVisible, setIsVisible ] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ( [entry] ) => setIsVisible(entry.intersectionRatio),
      { threshold: 0.6 }
    )
    let timeout;
    if (content.current) {
      timeout = setTimeout(() => {
        observer.observe(content.current)
      }, 500)
    }

    return () => {
      observer.disconnect()
      clearTimeout(timeout)
    }
  }, [content])

let unprocessedFiles = pendingFiles.length
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
    display: "flex", justifyContent: "center"
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
