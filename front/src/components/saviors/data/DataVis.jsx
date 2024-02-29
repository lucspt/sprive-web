import Visualization from "../../Visualization"
import { mockEmissions, mockPledges, mockPledgesLabels } from "../../../mock"
import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { formatRequest } from "../../../utils"

export default function DataVis() {

  const [ data, setData ] = useState({})
  const nav = useNavigate()

  useEffect(() => {
    const _AGGREGATIONS = {
      "pieChart": {
        "filters": [{"$group": {
          "_id": "$activity",
          "co2e": {"$sum": "$co2e"}
        },
      },],
      "collection": "logs",
      "query_type": "aggregate",
    }
  }

  const getData = async () => {
    const response = await fetch(
      "http://localhost:8000/saviors/data", 
      formatRequest("POST", _AGGREGATIONS["pieChart"])
    )
    const res = await response.json()
    console.log(res)
    const content = res.content
    setData({
      "labels": Array.from(content, (x) => x._id),
      "datasets": Array.from(content, (x) => x.co2e)
    })
  }
  getData()
  }, [])

  useEffect(() => console.log(data), [data])
  return (
    data.datasets && (
      <div className="content">
      <div className="data-plots">
        <div className="top row">
          <Visualization 
            id="line1"
            title="your journey so far"
            labels={mockPledgesLabels}
            type="line"
            datasets={[
              {
              label: "total emissions caused",
              data: mockEmissions,
              yAxisID: "y",
              segment: {
                borderColor: "red",
              }
            },
            {
              label: "total emissions saved",
              data: mockPledges,
              yAxisID: "y1",
              segment: {
                borderColor: "green",
              }
            },
          ]}
          options={{
            interaction: {
              mode: "nearest",
              axis: "y",
              intersect: false,
            },
            scales: {
              y: {
                type: "linear",
                display: true,
                position: "left"
              },
              y1: {
                type: "linear",
                display: true,
                position: "right"
              }
            },
            stacked: false,
          }}
        />
        <Visualization
          id="bar1"
            type="bar"
            labels={data.labels}
            datasets={[
              {
                label: "emissions by bar chart",
                data: data.datasets,
                segment: {
                  borderColor: "none",
                }
              }
            ]}
            options = {{
              plugins: {
                title: {
                  display: true
                },
                legend: {
                  display: true
                }
              }
            }}
        />
      </div>
    <div className="bottom row">
      <Visualization
        type="doughnut"
        id="doughnut"
        labels={data.labels}
        datasets={[
          {
            label: "emissions by activity",
            data: data.datasets
          }
        ]}
        backgroundColor="transparent"
        className="widget pie-chart"
        style={{maxWidth: 300, maxHeight: 350,}}
        options={{plugins: {"legend": {"display": true}}}}
        />
        <Visualization
        type="line"
        labels={data.labels}
        datasets={[
          {
            label: "emissions by activity",
            data: data.datasets
          },
        ]}
        options={{
          plugins: {
            tooltip: {
              mode: "index"
            },
          },
          interaction: {
            mode: "nearest",
            axis: "x",
            intersect: false,
          },
          scales: {
            x: {
              title: {
                display: true,
                text: "stacked line chart"
              }
            },
            y: {
              stacked: true,
              title: {
                display: true,
                text: "stacked"
              }
            }
          }
        }}
        id="line2"
        />
      </div>
    </div>
    </div>
    )
  )
}