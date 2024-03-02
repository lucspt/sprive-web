import { useEffect, useRef, memo, useContext } from "react";
import { formatCO2e, windowSize } from "../../../utils";
import Visualization from "../../Visualization";
import OverviewTodos from "./OverviewTodos";
import MobileOverview from "./mobile/MobileOverview";
import { SaviorContext } from "../../../contexts/SaviorContext";
import "./Overview.css"
import { useLoaderData } from "react-router-dom";

const Overview = memo(function Overview() {
  const content = useLoaderData();
  const animate = useRef(true);
  const { savior: { savior_type: saviorType } } = useContext(SaviorContext);

  const { emissions, pledges, products } = content;

  const randomDelay = () => Math.random() * 0.3;
  const barGraphDelay = randomDelay();

  useEffect(() => {animate.current = false}, []);

  return windowSize === "small" 
  ? <MobileOverview />
  : ( 
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

  return (
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
          }
        },
      }}
    />
)})


const CO2eDigit = ({ co2e }) => {
  const [ digit, metric ] = formatCO2e(co2e);

  return (
    <div>
      <span className="info-digit">{digit}</span>
      <span className="info-metric">{metric}/CO2e</span>
    </div>
  )
}
