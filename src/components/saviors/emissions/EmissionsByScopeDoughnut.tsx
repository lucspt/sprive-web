import { Plugin } from "chart.js";
import { GroupedEmissions } from "../../../types";
import { Visualization } from "../../visualization/Visualization";
import {
  defaultLegend, 
  doughnutInnerText,
  defaultTitle,
  darkBlue
} from "../../visualization/constants";

const COLORS = [
  darkBlue,
  "#287271",
  "#8ab17d",
]

/**
 * The doughnut which renders emissions by scope.
 * 
 * @param props
 * @param props.emissionsByScope
 * @returns The doughnut `Chart` component.
 */
export function EmissionsByScopeDoughnut({ emissionsByScope }: { emissionsByScope: GroupedEmissions }) {

  const labels = Object.keys(emissionsByScope);
  const data = Object.values(emissionsByScope);
  console.log(labels, data);

  return (
    <Visualization
      ariaLabel="Your emissions broken down by scope"
      type="doughnut"
      className="scopes-doughnut"
      dataTestId="scope-emissions-doughnut"
      id="scopesDoughnut"
      data={{
        labels,
        datasets: [{
          label: "CO₂e",
          data,
          backgroundColor: COLORS
        }]
      }}
      backgroundColor="transparent"
      options={{
        layout: { padding: 0 },
        plugins: {
          title: {
            ...defaultTitle,
            font: { size: 14 },
            text: "Emissions by scope",
          },
          legend: {
            ...defaultLegend, 
            position: "right",
          }
        },
        elements: {
          arc: {
            borderWidth: 0
          }
        },
      }}
      plugins={[doughnutInnerText] as Plugin[]}
    />
  )
}