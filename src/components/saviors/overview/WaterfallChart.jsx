import { useEffect } from "react";
import Visualization from "../../Visualization";
import { useState } from "react";
import { formatCO2e } from "../../../utils";

export default function WaterfallChart({ data }) {
  const [ waterfallValues, setWaterfallValues ] = useState([])
  let { data: dataset, labels } = data

  useEffect(() => {
    let current;
    const _waterfallVals = [];
    dataset.map((x) => {
      _waterfallVals.push([ (current || 0), x]);
      current = x;
    });
    setWaterfallValues(_waterfallVals);
  }, [dataset, labels]);

  return waterfallValues.length > 0 && (
    <Visualization 
      type="bar"
      id="waterfall"
      style={{ maxWidth: "80%", margin: "auto" }}
      labels={labels}
      datasets={[{
        data: waterfallValues,
        label: "CO2e",
        barThickness: 70,
      }]}
      options={{
        scales: {
          y: { beginAtZero: true }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function(ctx) {
                const x = waterfallValues[ctx.dataIndex]
                return `${formatCO2e(x[1] || x).join(" ")}`
              },
              afterLabel: function(ctx) {
                const { dataIndex } = ctx;
                if (dataIndex === 0) return;
                const current = waterfallValues[dataIndex]
                const diff = current[1] - current[0]
                return `${diff < 0 ? "-" : "+"}${formatCO2e(Math.abs(diff), 3).join(" ")} vs previous month`
              }
            }
          }
        }
      }}

    />
  )
}