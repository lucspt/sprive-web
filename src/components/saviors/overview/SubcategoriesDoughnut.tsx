import { Plugin, TooltipItem } from "chart.js";
import { capitalize } from "../../../utils/utils";
import { Visualization } from "../../visualization/Visualization";
import { SubcategoriesDoughnutProps } from "./types";
import { getSubcategoriesDoughnut } from "./utils";
import { 
  doughnutInnerText,
  defaultTitle,
  defaultTooltipLabel,
  defaultLegend,
  defaultSubtitle,
  DOUGHNUT_COLORS
 } from "../../visualization/constants";

const GET_SUBTITLE: {
  [key: string]: string,
} = {
  'purchased goods and services': 
    "the goods and services you buy",
  'capital goods': 
    "your capital expenses",
  'waste generated in operations': "generated waste",
  'business travel': "bussiness travels",
  "processing of sold products": "the processing of your products",
  'use of sold products': "the use of your products",
  'end-of-life treatment of sold products': "the end-of-life treatment of your products",
  'franchises': "your franchises",
}

/**
 * Rendered by `<OverviewBottomCharts />`. The doughnut chart which accompanies the `<EmissionsPerCategory />` 
 * horizontal bar chart. This chart takes the top category, that is the highest emitting category, rendered by
 * `<EmissionsPerCategory />`, and creates a doughnut chart breaking down the emissions per subcategories of that category. 
 * 
 * This doughnut limits the amount of subcategories to 5, summing the least emitting subcategories and putting 
 * them in a new category named 'other'.
 * 
 * 
 * @param props
 * @param props.emissionsPerSubcategory - An object with the emissions per subcategory,
 * for each category rendered by `<EmissionsPerCategory />`. Only the top emitting category will be used.
 * @returns A react component rendering a chart.js doughnut.
 */
export function SubcategoriesDoughnut({ emissionsPerSubcategory, categoryName }: SubcategoriesDoughnutProps) {

  const { data, labels } = getSubcategoriesDoughnut(emissionsPerSubcategory);

  const subtitleLabel = GET_SUBTITLE[categoryName];
  // animation delay has no effect
  return (
    <Visualization
      dataTestId="subcategories-doughnut"
      className="subcategory-doughnut"
      type="doughnut"
      id="subcategoryDoughnut"
      ariaLabel={`Emissions per subcategory of ${subtitleLabel}`}
      data={{
        labels,
        datasets: [{
          data,
          label: "CO₂e",
          backgroundColor: DOUGHNUT_COLORS,
        }]
      }}
      options={{
        plugins: {
          doughnutInnerText: {
            delay: 0
          },
          // updateAnimation: {
          //   animationUpdate: {
          //     delay: 0,
          //     duration: 1000
          //   }
          // },
          title: {
            ...defaultTitle,
            font: { size: 14.8 },
            text: capitalize(categoryName),
            align: "start",
          },
          legend: defaultLegend,
          subtitle: {
            ...defaultSubtitle,
            text: `Emissions from ${subtitleLabel || categoryName}`,
          },
          tooltip: {
            callbacks: {
              title: function([ ctx ]: [TooltipItem<"doughnut">]) {
                const label = labels[ctx.dataIndex].split(" ");
                label.pop();
                return label.join(" ");
              },
              label: defaultTooltipLabel
            }
          }
        },
        elements: {
          arc: {
            borderWidth: 0
          },
        },
      }}
      plugins={[doughnutInnerText] as Plugin[]}
    />
  )
}

// const updateAnimation = {
//   id: "updateAnimation",
//   afterRender: function(chart, args, options) {
//     chart.options.animation = options.animationUpdate
//   }
// }
