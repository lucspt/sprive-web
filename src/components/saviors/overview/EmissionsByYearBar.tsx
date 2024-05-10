import { ComponentPropsWithoutRef, memo } from "react";
import { Visualization } from "../../visualization/Visualization";
import { defaultTitle, defaultSubtitle } from "../../visualization/constants";
 import "./EmissionsByYearBar.css"
import { getEmissionsByYearData, emissionsByYearTooltip, emissionsByYearLegend } from "./utils";
import { Logs } from "../../../types";
import { YTickFormatter } from "../../visualization/utils";

/**
 * Renders the stacked bar chart at the top of the <Overview /> component.
 * 
 * This bar chart renders bars grouped by category, and in individual stacks for each year
 *  so that  a savior can visualize their emissions per year, per category for that year.
 * 
 * @param props 
 * @param props.logs - The logs to use to create datasets and pass to a chart.js Chart
 * @returns - A ReactComponent, which renders a chart.js drawn `<canvas>` element
 */
export const EmissionsByYearBar = memo(function EmissionsByYearBar({ logs }: { logs: Logs }) {
  const { labels, datasets, yearTotalEmissions } = getEmissionsByYearData(logs);
  const yTickFormatter = new YTickFormatter(datasets);
  if (!(labels && datasets && yearTotalEmissions)) return;
  
  return(
    <Visualization
      htmlLegendId="yearly-bar-legend"
      ariaLabel="A stacked bar chart displaying emissions per year, by category"
      type="bar"
      id="yearly-bar"
      dataTestId="yearly-emissions-stacked-bar"
      className="yearly-bar"
      data={{labels, datasets}}
      legendProps={{"data-testid": "yearly-bar-legend"} as ComponentPropsWithoutRef<"div">}
      options={{
        plugins: {
          htmlLegend: {
            containerID: "yearly-bar-legend",
          },
          title: {
            ...defaultTitle,
            text: "Emissions by year",
          },
          legend: { display: false },
          subtitle: {
            ...defaultSubtitle,
            padding: { bottom: 35 },
            text: `${yTickFormatter.currentMetric}CO₂e by year by category`
          },
          tooltip: {
            mode: "index",
            yAlign: "top",
            enabled: false,
            external: (ctx: any) => emissionsByYearTooltip(ctx, yearTotalEmissions)
          }
        },
        scales: {
          x: {
            stacked: true,
            ticks: {
              callback: function(_: any, index: number) {
                return labels[index].split(" ")[0];
              }
            }
          },
          y: {
            stacked: true,
            ticks: {
              callback: (value) => {
                return yTickFormatter.format(value);
              }
          }
        }
      }
      }}
      plugins={[emissionsByYearLegend]}
    />
  )
});