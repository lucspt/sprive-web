import { Chart, ChartComponentLike } from "chart.js";


export const _register = (registries: ChartComponentLike[], primaryColor: string) => {

  const defaults = Chart.defaults;
  
  defaults.borderColor = primaryColor;
  
  defaults.font.family = "monospace";
  defaults.color = "#eeeeee";
  
  defaults.elements.arc.borderWidth = 0;
  
  defaults.plugins.title.font = {"weight": "normal", "size": 14, "family": "monospace"};
  defaults.plugins.title.color = "#fff";
  defaults.plugins.title.padding = {top: 0, bottom: 20};
  defaults.plugins.tooltip.boxPadding = 4;
  
  defaults.scale.grid.color = primaryColor;
  defaults.scale.grid.display = false;
  
  
  const doughutOverrides = Chart.overrides.doughnut;
  doughutOverrides.cutout = "78%";
  const doughnutLabelOverrides = doughutOverrides.plugins.legend.labels;
  doughnutLabelOverrides.boxWidth = 20;
  doughnutLabelOverrides.boxHeight = 20;
  doughnutLabelOverrides.padding = 20;
  
  Chart.register(...registries);
}