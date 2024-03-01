import { memo } from "react"
import { formatCO2e } from "../../../../utils"

const MobileOverview = memo(function MobileOverview({ content }) {  
  const { emissions, pledges } = content;
  return emissions && (
    <> 
      <div className="overview-widgets" id="tuple1">
        <WidgetSquare title="total emissions" 
          infoDigit={emissions.total_co2e} 
          slideInDirection={"right"} 
        />
        <WidgetSquare title="emissions saved" 
          infoDigit={pledges.total_co2e} 
          slideInDirection={"left"} 
        />
      </div>
      <LongWidget id={"long1"} >
      </LongWidget>
      <WidgetTuple id={"tuple2"}/>
      <LongWidget id={"long2"}/>
    </>    
  )
})

const WidgetTuple = ({ id }) => {
  return (
    <div className="overview-widgets" id={id} key={id}>
      <div 
      className="widget tuple slide-in-right"
      style={{"animationDelay": `${randomDelay()}s`}}
      >
       <div>widget here</div>
      </div>
      <div className="widget tuple slide-in-left">
        <div>Widget here</div>
      </div>      
   </div>
  )
}
const randomDelay = () => Math.random() * 0.1;

const LongWidget = ({ id, children }) => {
  return (
    <div className={`widget long slide-in-bottom`} 
     id={id}
     key={id}
     style={{"animationDelay": `${randomDelay()}s`}}
    >
      <div className="long-widget carousel">
        {children}
        {/* <div>Widget 2 here carousel</div>  */}
      </div>
    </div>
  )

}

const WidgetSquare = ({ title, infoDigit, slideInDirection }) => {
  const [ digit, metric ] = formatCO2e(infoDigit)
  return (
    <div 
      className={`widget info-widget tuple slide-in-${slideInDirection}`}
      style={{"animationDelay": `${randomDelay()}s`}}
    >
      <div className="content">
        <span className="title">{title}:</span>
        <div className="info">
          <span className="digit">{digit}</span>
          <span className="metric">{metric}</span>
        </div>
      </div>
    </div>
  )
}
export default MobileOverview