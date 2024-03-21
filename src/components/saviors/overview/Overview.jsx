import { useEffect, useRef, memo, useContext, useMemo } from "react";
import { fetchData, getEmissionsByDate, windowSize } from "../../../utils";
import Visualization from "../../Visualization";
import MobileOverview from "./mobile/MobileOverview";
import { SaviorContext } from "../../../contexts/SaviorContext";
import "./Overview.css"
import { useLoaderData } from "react-router-dom";
import RectWidget from "./RectWidget";
import LargeWidget from "./LargeWidget";
import WaterfallChart from "./WaterfallChart";

export const overviewLoader = async () => {
  const res = await Promise.all([
    ...Object.values(OVERVIEW_AGGREGATIONS).map(
      agg => fetchData("saviors/data", "POST", agg),
      ),
      getEmissionsByDate(true)
  ])
  return {
    ...Object.keys(OVERVIEW_AGGREGATIONS).reduce(
      (acc, val, i) => Object.assign(acc, {[val]: res[i].content}), {}
    ), 
  "waterfall": res.at(-1)
}
}
export const OVERVIEW_AGGREGATIONS = {
  "emissions": {
    "collection": "logs",
    "query_type": "aggregate",
    "filters": [
      {"$match": {"co2e": {"$exists": true}}},
      {"$group": {
          "_id": "$category",
          "co2e": {"$sum": "$co2e"},
      }},
      {"$group": {
            "_id": null,
            "total_co2e": {"$sum": "$co2e"},
            "logs": {"$push": "$$ROOT"}
      }},
      {"$unwind": "$logs"},
      {"$project": {
            "percentage": {
                "$multiply": [{"$divide": ["$logs.co2e", "$total_co2e"]}, 100]
            },
            "co2e": "$logs.co2e",
            "label": "$logs._id" ,
            "_id": 0,
            "total_co2e": 1,
        }},
      {"$group": {
          "_id": null,
          "total_co2e": {"$first": "$total_co2e"},
          "co2e_per_category": {
              "$push": {
                  "percentage": "$percentage",
                  "label": "$label",
                  "co2e": "$co2e"
              }
          }
        }},
      {"$project": {
        "_id": 0,
      }}
    ]
  },
  "pledges": {
    "collection": "pledges",
    "query_type": "aggregate",
    "filters": [{"$project": {"co2e": 1}}]
  },
  "products": {
    "collection": "products",
    "query_type": "aggregate",
    "filters": [
      {"$match": {"published": true}}, 
      {"$group": {"_id": "$product_id",}},
      {"$count": "count"}
    ]
  },
}

const Overview = memo(function Overview() {
  const content = useLoaderData();
  const animate = useRef(true);
  const { savior: { savior_type: saviorType } } = useContext(SaviorContext);

  let { emissions, pledges, products } = content;
  emissions = emissions[0]
  const totalCO2e = emissions.total_co2e;

  const randomDelay = () => Math.random() * 0.3;
  const barGraphDelay = randomDelay();

  useEffect(() => {animate.current = false}, []);
  
  const totalCo2eSaved = useMemo(
    () => (
      pledges.length 
        ? pledges.reduce((acc, val) => acc + val.co2e, 0)
        : pledges.co2e || 0
    ), 
    [pledges]
  )

  const emissionsPerCategory = useMemo(
    () => emissions.co2e_per_category?.sort(
      (a, b) => a.percentage - b.percentage
    ).filter(x => x.label),
    [emissions]  
  )
  const pledgesMade = pledges instanceof Array 
    ? pledges.length
    : pledges.co2e 
    ? 1 : 0

  return windowSize === "small" 
  ? <MobileOverview />
  : ( 
    <div className="full-space overview">
      <section className="overview-top">
        <WaterfallChart data={content.waterfall}/>
      </section>
      <section>
        <div className={`widget-spacing${animate.current ? " static" : ""}`}>
          <div className="widgets-grid">
            <div className="widget-row">
            <RectWidget 
              digit={totalCO2e} 
              isCO2eDigit 
              animationClass="slide-in-left"
              getAnimationDelay={randomDelay}
              titleStyle={{textAlign: "end"}}
              title="total emissions"
            />
            <RectWidget animationClass="slide-up"
              title="emissions pledged"
              digit={totalCo2eSaved}
              isCO2eDigit
            />
            <RectWidget
              animationClass={"slide-in-right end "}
              style={{
              justifyContent: "space-evenly",
              flexDirection: "column"
            }}
            title="pledges made"
            digit={pledgesMade}
            getAnimationDelay={randomDelay}
            digitContainerStyle={{ 
              justifyContent: "space-between",
              alignItems: "center", 
              flexDirection: saviorType === "partners" ? "row" : "column"
            }}
            >
              {
                saviorType === "partners" && 
                <div className="pledge-info">
                <span className="info-title">products published</span>
                <span className="info-digit" style={{"textAlign": "end", fontSize: "1.4em"}}>{products?.length || 0}</span>
              </div>
              }
            </RectWidget>
            </div>
            <div className="widget-row" >
            <LargeWidget 
              animationClass="slide-in-left" 
              style={{animationDelay: `${barGraphDelay}s`}}
              noData={!(emissionsPerCategory?.length > 0)}
              title="emissions per category"
            >
              <div className="widget-ul">
                {emissionsPerCategory?.map(activity => (
                    <div className="item" key={activity.label}>
                      <span className="indicator">{activity.label}</span>
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
            </LargeWidget>

            <LargeWidget animationClass="slide-up"/>
            <LargeWidget 
              animationClass="slide-in-right"
              style={{
                justifySelf: "flex-end", 
                animationDelay: `${randomDelay()}s`,
                padding: 20, paddingLeft: 10
              }}
              title="emissions vs pledges"
              noData={
                !(
                  typeof totalCO2e === "number" 
                  && typeof totalCo2eSaved === "number" 
                )
              }
              noDataMessage={
                typeof totalCO2e !== "number" 
                  ? "no emissions recorded" 
                  : "no pledges made"
              }
            >
            <Visualization
                type="bar"
                id="bar"
                labels={["emissions", "pledges"]}
                datasets={[
                  {
                    label: "CO2e",
                    data: [totalCO2e, totalCo2eSaved],
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
                    onComplete: () => {delayed: true},
                    delay: () => 500
                  },
                  scales: {
                    x: { display: false },
                    y: { display: false },
                  },
                  plugins: {
                    legend: { display: false }
                  },
                }}
              />
            </LargeWidget>
            </div>
          </div>
        </div>
    </section>
  </div> 
  )
})

export default Overview
