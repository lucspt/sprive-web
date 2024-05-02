import { Chart, ChartType, ChartTypeRegistry, Plugin, TitleOptions, TooltipItem, defaults } from "chart.js";
import { _register } from "./registry";
import { formatCO2e } from "../../utils/utils";
// register by importing before using chart.js `defaults` to declare variables
export const ecoNeutral = "#4a749d";
export const softGrey = "#949eaa";
export const darkBlue = "#013470";
export const primaryColor = "#181b1f";
export const darker = "#131619";

export const DOUGHNUT_COLORS = [
  "#013470",
  "#014f9b",
  "#016ac5",
  "#229cff",
  "#74befa",
  "#c6e0f5",
];

export const STACKED_COLORS = [
  "#264653",  
  "#287271", 
  "#2a9d8f",  
  "#8ab17d",  
  "#e9c46a",  
  "#f4a261",  
  "#ec8151",  
  // "#e36040",  
  // "#bc6b85",  
]

export const backgroundColorPlugin: Plugin<ChartType> = {
  id: "canvasBackgroundColor",
  beforeDraw: (chart: Chart, _: any, options: { color: string } ) => {
    const { ctx } = chart;
    ctx.save();
    ctx.globalCompositeOperation = "destination-over";
    ctx.fillStyle = options.color;
    ctx.fillRect(0, 0, chart.width, chart.height);
    ctx.restore();
  }
};

// register before we access `defaults`.
_register(
  [backgroundColorPlugin],
  primaryColor
)


const { plugins } = defaults;
// default subtitle configuration
export const defaultSubtitle: TitleOptions = {
  ...plugins.subtitle,
  display: true,
  text: "Total CO₂e per category",
  font: { size: 13, },
  padding: { top: 0, bottom: 17 },
  color: softGrey,
  align: "start" as const
}

// default title configuration
export const defaultTitle: TitleOptions = {
  ...plugins.title,
  display: true,
  text: "Emissions per category",
  align: "start",
  font: { size: 16 }
}

// default legned configuartion

export const defaultLegend = {
  display: true,
  position: "right" as const,
  align: "center" as const,         
  labels: {
    usePointStyle: true,
    pointStyle: "circle", 
  },
}

export const defaultTooltipLabel = <ChartType extends keyof ChartTypeRegistry>(
  tooltipItems: TooltipItem<ChartType>
) => {
  return `${formatCO2e(tooltipItems.raw as number)}CO₂e`;
};

// Plugin to place the sum of all dataset values in the center of a doughnut.
export const doughnutInnerText: Plugin<"doughnut"> = {
  id: "doughnutInnerText",
  afterDatasetDraw(chart: Chart<"doughnut">, args: any, options: any) {
    const { ctx } = chart;
    const meta = args.meta;
    const xCoor = meta.data[0].x;
    const yCoor = meta.data[0].y - 7;
    const co2e = meta.total;
    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `${options.digitFontSize} monospace`;
    ctx.fillStyle = "#eeeeee";
    const [ digit, metric ] = formatCO2e(co2e, { maximumFractionDigits: 2, stringify: false});
    ctx.fillText(digit, xCoor, yCoor)
    ctx.font = `${options.metricFontSize} monospace`;
    ctx.fillStyle = softGrey
    ctx.fillText(`${metric}CO₂e`, xCoor, yCoor + 30);
    ctx.restore();
  },
  defaults: {
    digitFontSize: "1.7em",
    metricFontSize: "1.2em",

  }
}