import { memo, useState, useEffect, useCallback } from "react"
import Visualization from "../../Visualization"
import DataTable, { toggleRowDropdown } from "../../DataTable"
import { innerTextPlugin } from "../../Visualization"
import { fetchData, formatCO2e, formatRequest } from "../../../utils"

const COLUMNS = ["name", "category", "activity", "value", "unit", "CO2e"]
const objToCsv = (data) => {

  let csvData = data.map(
    ({ activity, value, unit, co2e }) => [activity, value, unit, co2e].join(",")
  ).join("\n")

  csvData = [COLUMNS, csvData].join("\n")

  return `data:text/csv;charset=utf-8, ${csvData}`
}

const Emissions = memo(function Emissions() {

  const getLegendConfig = useCallback(() => {
    return window.innerWidth <= 760 
      ? {"position": "bottom", "align": "center"} 
      : {"position": "left", "align": "start"}
  }, [window.innerWidth])
  
  const [ data, setData ] = useState({})
  
  useEffect(() => {
    
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
    "barChart": {
      "filters": [
        {"$match": {"co2e": {"$exists": true}}},
        {"$group": {
              "_id": {
                  "month": {"$month": "$created"},
                  "year": {"$year": "$created"},
              },
              "co2e": {"$sum": "$co2e"}
          },
        },
        {"$sort": {"_id.year": -1, "_id.month": -1}},
        {"$limit": 28}
      ],
      "collection": "logs",
      "query_type": "aggregate",
    }
    }
    const getData = async ( requests ) => {
      const results = await Promise.all([
        fetchData("saviors/emissions"),
        ...requests.map(async req => {
        let response = await fetch(
          `http://localhost:8000/saviors/data`, formatRequest("POST", req)
        )
        return response.json()
      })
    ])
      return results
    }
    if (!data.length) {
      getData(Object.values(_AGGREGATIONS))
      .then(res => {
        let [ table, pieChart, barChart ] = res;
        console.log(table, pieChart, barChart)
        const { content: pieContent } = pieChart
        const pieChartData = Array.from(pieContent, x => x.co2e)
        pieChart = {
          "labels": Array.from(pieContent, x => x._id),
          "data": pieChartData,
        }
        setData({
          pieChart: pieChart,
          table: table.content,
          barChart: barChart.content.reverse()
        })
      })
      }

    }, [])

    const getBarChartLabels = useCallback((barChart) => {
      const monthMappings = {
        1: "january", 2: "february", 3: "march", 4: "april", 5: "may", 6: "june",
        7: "july", 8: "august", 9: "september", 10: "october", 11: "november",
      }
      let currentYear;
      return barChart.map((x, i) => {
        const { _id, _id: { month, year } } = x
        if (i !== 0 && month !== 12 && currentYear === year) {
          return monthMappings[month]
        } else {
          currentYear = year 
          return year
        }
      })
    }, [])
    
  const { pieChart, table, barChart } = data
  return table && (
    <div className="emissions">
      <div className="distribution">
      <div className="chart border-right" style={{position: "relative", alignSelf: "flex-end"}}>
        <Visualization
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
          style={{maxWidth: 260, maxHeight: 200,}}
          options={{
            plugins: {
              legend: {
                ...getLegendConfig(),
                display: true,
                labels: {
                  boxWidth: 20,
                  boxHeight: 20,                
                },
              },
            },
            elements: {
              arc: {
                borderWidth: 0
              }
            }
          }}
          plugins={[innerTextPlugin]}
          />
      </div>
        <Visualization
          type="bar"
          id="bar"
          datasetsColors={["#1B4242"]}
          labels={getBarChartLabels(barChart)}
          datasets={[
            {
              data: Array.from(barChart, x => x.co2e),
              label: "CO2e",
              barThickness: 30,
            }
          ]}
          style={{ minHeight: 200, minWidth: 200, flex: 1, display: "flex", maxWidth: 700}}
          options={{
            plugins: {
              tooltip: {
                callbacks: {
                  title: function(context) {
                    return Object.values(barChart[context[0].dataIndex]._id).join("/")
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
          title="traceback"
          downloadData={objToCsv(table)}
          importData="../data/upload"
          >
          {table.map(row => <Row rowData={row} key={row._id}/>)}
        </DataTable>
      </div>
    </div>
    )

})

export default Emissions

const Row = memo(({ rowData }) => {
//   const date = new Date(
//     rowData.created
//   )
//   const dateAbbreviation = date.toLocaleDateString(
//     undefined, {month: "2-digit", year: "2-digit"}
//   )
//   const dateString = date.toDateString()

  return (
    <div className="row-wrapper white-hov"
      onClick={toggleRowDropdown}>
      <div className="row">
        <span>{rowData.name}</span>
        <span>{rowData.category}</span>
        <span>{rowData.activity}</span>
        <span>{rowData.value}</span>
        <span>{rowData.unit}</span>
        <span className="align-end">{formatCO2e(rowData.co2e).join(" ")}</span>
        <span className="material-symbols-rounded align-end flip">
          expand_more
        </span>
      </div>
      <div className="dropdown">
        <div className="insights">
          <div className="info">
            <span>data source:</span>
            <span>{rowData.source_file.name}</span>
          </div>
          <div className="info">
            <span>factor source:</span>
            <span>{rowData.factor_source || "ecoinvent"}</span>
          </div>
        </div>
        <div className="traceback">
          <span>CO2e calculation:</span>
          <div className="calculation">
            <span>formula: value X factor = CO2e</span>
            <span>{rowData.value} X {rowData.co2e / rowData.value} = {rowData.co2e}</span>
          </div>
        </div>
      </div>
    </div>
  )
})
