;import { useEffect, memo, useState } from "react";
import { Chart } from "chart.js/auto"
import { formatCO2e } from "../utils";

// const _colors = [
//   // "#9d86c7",
//   // "#e4d5f3",
//   // "#7288c5",
//   // "#092635",
//   "#1B4242",
//   "#5C8374",
//   "#9EC8B9", 
//   "#030637",
//   "#3C0753",
//   "#720455",
//   "#910A67",
//   "#000",
//   "#fff"
// ]

const _colors = [
  "#1B4242",
  "#5C8374",
  "#3A4D39",
  "#739072",
  "#ECE3CE",
  "#4F6F52",
]

let defaultbackgroundColor = "#0d3043";
defaultbackgroundColor = "#0d3043" ;
defaultbackgroundColor = "transparent";

const defaults = Chart.defaults;
defaults.borderColor = "#181b1f";
defaults.font.family = "monospace";
defaults.color = "#eeeeee";
defaults.elements.arc.borderWidth = 0;
defaults.plugins.title.font = {"weight": "normal", "size": 14, "family": "monospace"};
defaults.plugins.title.padding = {"bottom": 20};
defaults.plugins.tooltip.boxPadding = 4;

let doughutOverrides = Chart.overrides.doughnut;
doughutOverrides.cutout = "78%";
doughutOverrides = doughutOverrides.plugins.legend.labels;
doughutOverrides.boxWidth = 20;
doughutOverrides.boxHeight = 20;
doughutOverrides.padding = 20;


export const innerTextPlugin = {
  id: "innerText",
  afterDatasetDraw(chart, args, options) {
    const { ctx } = chart;
    const meta = args.meta;
    const xCoor = meta.data[0].x;
    const yCoor = meta.data[0].y;
    const co2e = meta.total;
    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.verticalAlign = "end";
    ctx.font = "1.3em monospace";
    ctx.fillStyle = "#fff";
    ctx.fillText(formatCO2e(co2e).join(" "), xCoor, yCoor);
    ctx.restore();
  }
}

const backgroundColorPlugin = {
  id: "canvasBackgroundColor",
  beforeDraw: (chart, args, options) => {
    const { ctx } = chart;
    ctx.save();
    ctx.globalCompositeOperation = "destination-over";
    ctx.fillStyle = options.color || "#e4d5f3";
    ctx.fillRect(0, 0, chart.width, chart.height);
    ctx.restore();
  }
}

Chart.register(backgroundColorPlugin);

const Visualization = memo(function Visualization({ 
  type,
  labels,
  datasets,
  id,
  options={},
  style={},
  unit = "kg",
  className = "",
  backgroundColor=null,
  plugins=[],
  datasetsColors=null,
  ariaLabel
}) {
  const [ _chart, setChart ] = useState(null);

  useEffect(() => {
    const visOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          boxPadding: 5,
          callbacks: {
            label: (tooltipItems, data) => `${formatCO2e(tooltipItems.raw).join(" ")}/CO2e`
          },
        },
        legend: {
          display: true
        },
          canvasBackgroundColor: {
            color: backgroundColor || defaultbackgroundColor
          },
        },
      }

    for (let [k, v] of Object.entries(options)) visOptions[k] = { ...visOptions[k], ...v };
    let chart;
    if (chart) chart.destroy();
    const _datasetsColors = datasetsColors || _colors;
    datasets.forEach(x => x.backgroundColor = _datasetsColors);
    chart = new Chart(
        id, {
          type: type,
          data: {
            labels: labels,
            datasets: datasets
          },
          options: visOptions,
          plugins: [backgroundColorPlugin, ...plugins]
        }
        );
    setChart(chart);
    return () => {
      if (chart) {
        chart.destroy();
      }
  }
  }, []) 

  console.log("rendering vis", id, )
  
  return (
    <div className={`chart-wrapper ${className}`} style={style}>
      <canvas id={id} aria-label={ariaLabel}></canvas>
    </div>
  )
})

export default Visualization 