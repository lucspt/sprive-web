import { ChartData, ChartOptions, ChartType, Plugin } from "chart.js";
// import { ChartJsDataset } from "../../types";
import { CSSProperties, ComponentPropsWithoutRef } from "react";

export interface VisualizationProps {
  type: ChartType,
  // labels: string[] | undefined,
  // datasets: ChartJsDataset[],
  data: ChartData
  id: string,
  options?: ChartOptions,
  style?: CSSProperties,
  className?: string,
  backgroundColor?: string,
  plugins?: Plugin[],
  ariaLabel: string,
  htmlLegendId?: string,
  legendProps?: ComponentPropsWithoutRef<"div">,
  dataTestId?: string
}