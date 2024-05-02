import {Chart, ChartType } from "chart.js";

declare module 'chart.js' {
  export interface PluginOptionsByType<TType extends ChartType> {
    doughnutInnerText?: {
      delay?: number
    },
    htmlLegend: {
      containerID: string
    },
    canvasBackgroundColor: {
      color: string
    },
    showBarValues: boolean,
  }
}

 