import { memo, useState, useEffect, useCallback } from "react"
import Visualization, { innerTextPlugin } from "../../Visualization"
import DataTable from "../../DataTable"
import { fetchData, formatRequest, getEmissionsByDate } from "../../../utils"
import Row from "./Row"
import "./Emissions.css"
import NoData from "../../NoData";
import { useNavigate } from "react-router-dom"

const COLUMNS = ["name", "category", "activity", "value", "unit", "CO2e"];
const objToCsv = (data) => {

  let csvData = data.map(
    ({ activity, value, unit, co2e }) => [activity, value, unit, co2e].join(",")
  ).join("\n");

  csvData = [COLUMNS, csvData].join("\n");

  return `data:text/csv;charset=utf-8, ${csvData}`;
}

const doughnutLegendPlugin = {
  beforeInit(chart) {
    const originalFit = chart.legend.fit;
    chart.legend.fit = function fit() {
      originalFit.bind(chart.legend)();
      this.width += 15;
    }
  }
}

const _AGGREGATIONS = {
  "pieChart": {
  "filters": [
    {"$match": {"co2e": {"$exists": true}}},
      {"$group": {
        "_id": "$category",
        "co2e": {"$sum": "$co2e"},
    },
  },
  {"$sort": {"co2e": -1}}, {"$limit": 5}
],
  "collection": "logs",
  "query_type": "aggregate",
},
// barChart: EMISSIONS_BY_DATE_AGG
};

const Emissions = memo(function Emissions() {
  const nav = useNavigate();
  
  const [ data, setData ] = useState(null);
  
  useEffect(() => {
    
    const getData = async ( requests ) => {
      const results = await Promise.all([
        fetchData("saviors/emissions"),
        getEmissionsByDate(),
        ...requests.map(async req => {
        let response = await fetch(
          `http://localhost:8000/saviors/data`, formatRequest("POST", req)
        )
        return response.json()
      })
    ]);
      return results;
    }
    if (data === null) {
      getData(Object.values(_AGGREGATIONS))
      .then(res => {
        let [ table, barChart, pieChart ] = res;
        const { content: pieContent } = pieChart;
        const pieChartData = Array.from(pieContent, x => x.co2e);
        pieChart = {
          "labels": Array.from(pieContent, x => x._id),
          "data": pieChartData,
        };
        setData({
          pieChart: pieChart,
          table: table.content,
          barChart: barChart
        });
      })
    }
  }, []);
    
  if (data === null) return;

  
  const { pieChart, table, barChart } = data;
  const pieChartLegend = window.innerWidth <= 760 
  ? {"position": "bottom", "align": "center"} 
  : {"position": "left", "align": "center"}

  return table.length > 0 ? (
    <div className="emissions">
      <div className="distribution">
      <div className="chart border-right" style={{position: "relative", alignSelf: "flex-end"}}>
        <Visualization
          style={{ maxWidth: "25vw", }}
          type="doughnut"
          id="doughnut"
          labels={pieChart.labels}
          datasets={[
            {
              label: "emissions",
              data: pieChart.data
            }
          ]}
          backgroundColor="transparent"
          options={{
            layout: { padding: 0 },
            plugins: {
              title: {
                display: true,
                text: "Emissions by category",
                align: "start",
              },
              legend: {
                ...pieChartLegend,
                display: true,
                labels: {
                  usePointStyle: true,
                  pointStyle: "circle",             
                },
              },
            },
            elements: {
              arc: {
                borderWidth: 0
              }
            }
          }}
          plugins={[innerTextPlugin, doughnutLegendPlugin]}
          />
      </div>
        <Visualization
          type="bar"
          id="bar"
          datasetsColors={["#1B4242"]}
          labels={barChart.labels}
          datasets={[
            {
              data: barChart.data,
              label: "CO2e",
              barThickness: 30,
            }
          ]}
          style={{ minHeight: 200, minWidth: 200, flex: 1, display: "flex", maxWidth: 700 }}
          options={{
            plugins: {
              title: {
                display: true,
                text: "Emissions over time",
                align: "start",
                padding: {bottom: 20},
              },
              tooltip: {
                callbacks: {
                  title: function(context) {
                    return Object.values(barChart.originalLabels[context[0].dataIndex]).join("/")
                  },
                  label: (tooltipItems, _) => `${tooltipItems.raw} kg/CO2e`
                }
              },
              legend: {
                display: false
              }
            }
          }}
         />
      </div>
      <div className="table">
        <DataTable 
          className="emissions"
          columns={COLUMNS}
          title="Breakdown"
          downloadData={objToCsv(table)}
          importData="../data/upload"
        >
          {table.map(row => <Row rowData={row} key={row._id}/>)}
        </DataTable>
      </div>
    </div>
  ) : 
  ( <NoData 
      message="upload your activity and/or spend data to get started!" 
      onClick={() => nav("/saviors/data/upload")}
    />
  )
})

export default Emissions