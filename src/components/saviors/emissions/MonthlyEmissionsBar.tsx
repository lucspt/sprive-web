import { GroupedEmissions } from "../../../types";
import { Visualization } from "../../visualization/Visualization";
import { darkBlue, defaultTitle } from "../../visualization/constants";
import { turnDateStringToSortable } from "./utils";

const months = [
  "Jan",
  "Feb",
  "Mar",
  "April",
  "May",
  "June",
  "July",
  "August",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
]
/**
 * Renders a bar chart displaying the savior's emissions by month 
 * for the most relevant years, w.r.t the joined date of the savior.
 * (See `filterLogsForRelevantDate` for more).
 * 
 * @param props 
 * @param props.emissionsByMonth - The savior's emissions, grouped by month.
 * @returns The bar chart component.
 */
export function MonthlyEmissionsBar({ emissionsByMonth }: { emissionsByMonth: GroupedEmissions }) {


  const _DATASET = Object.fromEntries(
    Object.entries(emissionsByMonth).sort(([a, ], [b, ]) => {
      return turnDateStringToSortable(a) - turnDateStringToSortable(b);
    })
  );

  const labels = Object.keys(_DATASET);
  const numLabels = labels.length;

  return (
    <Visualization
          type="bar"
          ariaLabel="A bar chart displaying your montly emissions"
          id="monthlyBar"
          className="monthly-bar"
          dataTestId="monthly-emissions-bar"
          data={{
            labels,
            datasets: [{
              data: Object.values(_DATASET),
              label: "CO₂e",
              barThickness: 30,
              backgroundColor: darkBlue
            }]
          }}
          options={{
            plugins: {
              title: {
                ...defaultTitle,
                font: { size: 14 },
                text: "Emissions over time",
              },
              legend: {
                display: false
              },
            },
            scales: {
              x: { 
                border: { 
                  display: true,
                  color: "var(--secondary-bg)",
                },
                ticks: { 
                  display: true,
                  callback: function(_, index) {
                    // console.log(numLabels > 1, "here")
                    let [ label, year ] = labels[index].split("/")
                    if (label === "1" || (index === 0 && numLabels > 1)) {
                      return year
                    } else {
                      return months[Number(label) - 1];
                    }
                  }
                }
               }
            },
          }}
         />
  )
}