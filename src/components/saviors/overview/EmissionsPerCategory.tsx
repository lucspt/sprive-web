import { Visualization } from "../../visualization/Visualization";
import { darkBlue } from "../../visualization/constants";
import { EmissionsPerCategoryProps } from "./types";
import { emissionsPerCategoryBarValues, PER_CATEGORY_CHART_PADDING } from "./utils";

/**
 * 
 * @param props 
 * @param data - The datapoints to render the bars with
 * @param labels - The labels to render, in the same order to match `data`'s datapoints
 * @param barDelay - Renders each bar with this value * their index position in `data`, 
 * for some the delay does not seem to work / have any effect currently.
 * @returns The emissions per category bar chart component.
 */
export function EmissionsPerCategory({ data, labels, barDelay=150 }: EmissionsPerCategoryProps) {

  const numDataPoints = data.length;
  if (numDataPoints < 1) return;
  const barThickness = Math.min(52, Math.max(100 / numDataPoints, 52));
  
  return (
    <Visualization
      className="categorical-bar"
      ariaLabel="A horizontal bar chart displaying emissions per category"
      type="bar"
      dataTestId="category-bar"
      id="categories"
      data={{
        labels,
        datasets: [{
          data,
          label: "CO₂e",
          indexAxis: "y",
          barThickness,
          borderRadius: barThickness / 4,
          backgroundColor: [darkBlue]
        }]
      }}
      options={{
        layout: {
          padding: { 
            right: PER_CATEGORY_CHART_PADDING,
            left: 0
          },
        },
        indexAxis: "y",
        scales: {
          y: {
            type: "category",
            border: { display: false },
            ticks: { crossAlign: "far" }
          },
          x: {
            border: { display: false },
            ticks: { display: false },

          }
        },
        plugins: {
          legend: { display: false },
          showBarValues: true,
        },
        animation: {
          delay: (context: { dataIndex: number }) => {
            return context.dataIndex * barDelay
          }
        },
      }}
      plugins={[emissionsPerCategoryBarValues]}
    />
  )
}