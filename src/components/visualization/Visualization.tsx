/**
 * Variables, components, and utilities for creating `Chart`'s with Chart.js
 * 
 */
import { useEffect, memo, useRef } from "react";
import { Chart, ChartItem, ChartOptions, Plugin } from "chart.js/auto"
import { VisualizationProps } from "./types";
import { backgroundColorPlugin, defaultTooltipLabel } from "./constants";
import { mergeObjects } from "../../utils/utils";


/**
 * Component which will render a chart.js Chart.
 * 
 * @param props
 * @param props.type - The chart type
 * @param props.data - A chart.js data object containing the labels and datasets to render
 * @param props.id - The id to give to the `<canvas>` element rendering this chart
 * @param props.options - Chart.js chart configuration options object
 * @param props.
 */
export const Visualization = memo(function Visualization({ 
  type,
  // labels,
  // datasets,
  data,
  id,
  options={},
  style={},
  className = "",
  backgroundColor="transparent",
  plugins=[],
  ariaLabel,
  htmlLegendId="",
  legendProps,
  dataTestId
}: VisualizationProps) {
  const chartRef = useRef<Chart>();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const datasets = data.datasets.slice();
  const labels = data.labels?.slice();

  useEffect(() => {
    const visOptions: ChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          boxPadding: 5,
          callbacks: {
            label: defaultTooltipLabel
          },
        },
        legend: {
          display: true
        },
          canvasBackgroundColor: {
            color: backgroundColor
          },
        },
      }

    // for (let [k, v] of Object.entries(options)) {
    //   if (typeof v === "object") {
    //     visOptions[k] = { ...visOptions[k], ...v };
    //   } else {
    //     visOptions[k] = v;
    //   };
    // };

    chartRef.current = new Chart((canvasRef.current as ChartItem), {
      type: type,
      data: data,
      options: mergeObjects(visOptions, options),
      plugins: [backgroundColorPlugin, ...plugins] as Plugin[]
    });
    return () => {
      if (chartRef.current) {
        (chartRef.current as Chart).destroy();
      };
    }
  }, []);

  useEffect(() => {
    if (chartRef.current) {
      (chartRef.current as Chart).data.datasets.forEach((ds, i) => {
        ds.data = datasets[i].data.slice();
      });
      (chartRef.current as Chart).update();
    }
  }, [data.datasets]);

  useEffect(() => {
    if (chartRef.current) {
      (chartRef.current as Chart).data.labels = labels;
      (chartRef.current as Chart).update();
    }
  }, [data.labels]);

  return (
    <div className={`chart-wrapper ${className}`} style={style} data-testid={dataTestId}>
      { htmlLegendId && <div id={htmlLegendId} {...legendProps}></div>}
      <canvas id={id} aria-label={ariaLabel} ref={canvasRef}></canvas>
    </div>
  )
});