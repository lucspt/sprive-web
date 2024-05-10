import { STACKED_COLORS, softGrey } from "../../visualization/constants";
import { formatCO2e, sumArray } from "../../../utils/utils";
import { ChartJsDataset, DynamicObject, GroupedEmissions, Logs } from "../../../types";
import { BarElement, Chart, LegendItem } from "chart.js";
import { EmissionsByYearData, BottomCharts } from "./types";
import { GHGCategoryToAbbreviatedName } from "../../../constants";
const MAX_CATEGORIES = 5;
const MAX_BARS = 3

/**
 * Function from stackoverflow.
 * Joins an array of labels by comma, adding 'and' in between the last. 
 * two elements if gramtically correct.
 * 
 * Used to create the `<OverviewBottomCharts />` header.
 */
export const categoryListToString = (arr: string[]) => {
  const { length } = arr;
  if (length === 1) return arr[0];
  const firsts = arr.slice(0, length - 1);
  const last = arr[length - 1];
  return `${firsts.join(', ')} and ${last}`;
};

/**
 * Given logs, create a stacked bar chart grouped by categories and stacked by year.
 * Also returns the total emissions for each year.
 * @param logs - The logs to create the datasets from
 * @returns labels and datasets to render the `<EmissionsByYear />` bar chart as 
 * well as the sum of each year's emissions
 */
export const getEmissionsByYearData = (logs: Logs): EmissionsByYearData => {

    // this effect seems overly complex, with lots of loops. Maybe we can simplify it someway
    const LOGS = logs.slice().sort((a, b) => b.co2e - a.co2e);
    const emissionsPerYear: GroupedEmissions<GroupedEmissions> = {};
    // group by emissions per year per category
    let _uniqueCategories: Set<string> = new Set();
    let totalEmissions = 0;
    const yearTotalEmissions: GroupedEmissions = {};
    LOGS.map(({ co2e, source_file, ghg_category }) => {
      const year = new Date(`${source_file.upload_date}Z`).getFullYear();
      const _category = GHGCategoryToAbbreviatedName[ghg_category as keyof typeof GHGCategoryToAbbreviatedName]
      _uniqueCategories.add(_category);
      yearTotalEmissions[year] = (yearTotalEmissions[year] || 0) + co2e;
      if (!emissionsPerYear[year]) emissionsPerYear[year] = {};
      if (!emissionsPerYear[year][_category]) emissionsPerYear[year][_category] = 0;
      totalEmissions += co2e;
      emissionsPerYear[year][_category] += co2e;
    });

    const labels = Object.keys(emissionsPerYear).slice(0, MAX_BARS);
    let _datasets: DynamicObject<ChartJsDataset> = {};
    const numCategories = _uniqueCategories.size;
    const uniqueCategories = Array.from(_uniqueCategories);
    let otherCategories: undefined | string[];
    if (numCategories > MAX_CATEGORIES) {
      // if more than 5 categories we just move the rest to an "other" category summing everything up
      otherCategories = uniqueCategories.splice(MAX_CATEGORIES);
    };
    labels.map(year => {
      uniqueCategories.map((category, i) => {
        const thisCategoryDs = _datasets[category];
        const categoryEmissionsForYear = emissionsPerYear[year][category];
        if (thisCategoryDs) {
          thisCategoryDs.data.push(categoryEmissionsForYear)
        } else {
          _datasets[category] = {
            label: category,
            stack: year,
            data: [categoryEmissionsForYear],
            maxBarThickness: 200,
            backgroundColor: STACKED_COLORS[i]
          }
        }
      })
      otherCategories?.map(otherCategory => {
        // here we sum the othercategories
        const categoryEmissionsForYear = emissionsPerYear[year][otherCategory];
        const { other } = _datasets;
        if (other) {
          const indexToPushTo = labels.findIndex(_year => _year === year); {
          if (indexToPushTo) {
            other.data[indexToPushTo] += (categoryEmissionsForYear || 0); 
          } else {
            other.data.push((categoryEmissionsForYear || 0));
          };
        }
        } else {
          _datasets.other = {
            label: "Other",
            stack: year,
            data: [categoryEmissionsForYear],
            maxBarThickness: 200,
            backgroundColor: STACKED_COLORS.at(-1)
          };
        };
      })
    });

  const datasets: ChartJsDataset[] = Object.values(
    _datasets
  ).filter(x => labels.includes(x.stack));
  const datasetsZipped = Array.from(datasets, x=> x.data);
  labels.map((_, dataIndex) => {
    // remove years where all values are empty from here 
    // by zipping datasets and checking if the index in loop is falsy value for each one
    if (datasetsZipped.every(ds => !ds[dataIndex])) {
      datasets.forEach((x) => x.data.splice(dataIndex, 1));
      labels.splice(dataIndex, 1);
    };
  });
  return { labels, datasets, yearTotalEmissions };
}

// helper for htmlLegendPlugin
const _getOrCreateLegendList = (_: any, id: string) => {
  const legendContainer = document.getElementById(id)!;
  let listContainer = legendContainer.querySelector('ul');

  if (!listContainer) {
    listContainer = document.createElement('ul');
    legendContainer.appendChild(listContainer);
  };
  return listContainer;
};

// Renders the legend to the left of the `<EmissionsByYearBar />`
export const emissionsByYearLegend = {
  id: 'htmlLegend',
  afterUpdate(chart: Chart<"bar">, _: any, options: any) { // TODO: have to figure out how to static type Chartjs
    const ul = _getOrCreateLegendList(chart, options.containerID);
    while (ul.firstChild) {
      ul.firstChild.remove();
    }

    const _items = chart.options?.plugins?.legend?.labels;
    if (!_items?.generateLabels) return;
    const items = _items.generateLabels(chart);
    const title = document.createElement("p");
    title.innerText = "Categories";
    title.className = "legend-title";
    ul.append(title);
    const itemsContainer = document.createElement("div");
    ul.append(itemsContainer);
    
    items.forEach((item: LegendItem) => {
      const li = document.createElement('li');
      li.onclick = () => {
        chart.setDatasetVisibility(
          item.datasetIndex as number, !chart.isDatasetVisible(item.datasetIndex as number)
        );
        chart.update();
      };

      const boxSpan = document.createElement('span');
      boxSpan.style.background = item.fillStyle as string;
      boxSpan.style.borderColor = item.strokeStyle as string;

      const textContainer = document.createElement('p');
      textContainer.style.textDecoration = item.hidden ? 'line-through' : '';

      const text = document.createTextNode(item.text);
      textContainer.appendChild(text);

      li.appendChild(boxSpan);
      li.appendChild(textContainer);
      itemsContainer.appendChild(li);
    });
  }
};

const _getOrCreateTooltip = (chart: Chart<"bar">) => {
  let tooltipEl = document.getElementById("yearly-bar-tooltip")

  if (!tooltipEl) {
    tooltipEl = document.createElement('div');
    tooltipEl.id = "yearly-bar-tooltip";
    chart?.canvas?.parentNode?.appendChild(tooltipEl);
  };

  return tooltipEl;
};

// Creates the tooltip used by the `<EmissionsByYearBar />` chart
export function emissionsByYearTooltip(context: any, tooltipData: GroupedEmissions) {
  const { chart, tooltip } = context;
  const tooltipEl = _getOrCreateTooltip(chart) as HTMLElement;
  if (tooltip.opacity === 0) {
    tooltipEl.style.opacity = "0";
    return;
  }

  const { dataPoints, title } = tooltip;
  if (dataPoints && title) {
    const tooltipItems = dataPoints.filter((
      { dataIndex, dataset }: { dataIndex: number, dataset: ChartJsDataset }) => {
        return dataset.data[dataIndex]
    });
    const labelsContainer = document.createElement("div");
    labelsContainer.classList.add("tooltip");

    const titleEl = document.createElement("p");
    const year = title[0];
    titleEl.appendChild(document.createTextNode(year));
    const [ yearEmissions, yearEmissionsMetric ] = formatCO2e(tooltipData[year], { stringify: false });
    const yearEmissionsDiv = document.createElement("div")
    yearEmissionsDiv.classList.add("title-number");
    const spanDigit = document.createElement("span"),
    spanMetric = document.createElement("span");
    spanDigit.appendChild(document.createTextNode(yearEmissions))
    spanMetric.appendChild(document.createTextNode(`${yearEmissionsMetric}CO₂e`));
    yearEmissionsDiv.appendChild(spanDigit);
    yearEmissionsDiv.appendChild(spanMetric);
    titleEl.appendChild(yearEmissionsDiv);

    labelsContainer.appendChild(titleEl);

    tooltipItems.map(({ dataIndex, dataset}: { dataIndex: number, dataset: ChartJsDataset }) => {
      const emissions = dataset.data[dataIndex];
      if (emissions) {
        const labelContainer = document.createElement("div");
        labelContainer.classList.add("label-container");
        const boxSpan = document.createElement("span");
        boxSpan.classList.add("box");
        boxSpan.style.backgroundColor = dataset.backgroundColor as string;
        const label = document.createElement("div");
        label.classList.add("label");
        label.appendChild(document.createTextNode(dataset.label));
        const emissionsSpan = document.createElement("span")
        const [ emissionsDigit, _ ] = formatCO2e(emissions, { stringify: false });
        emissionsSpan.appendChild(
          document.createTextNode(
            `${((Number(emissionsDigit) / Number(yearEmissions)) * 100).toFixed(2)}%`
          )
        );
        label.appendChild(emissionsSpan);

        labelContainer.appendChild(boxSpan);
        labelContainer.appendChild(label);
        labelsContainer.appendChild(labelContainer);
      };
      while (tooltipEl.firstChild) {
        tooltipEl.firstChild.remove();
      };
      tooltipEl.appendChild(labelsContainer);
      const offsetBottom = tooltipItems.reduce((
        acc: number, { element }: { element: {height: number | null}}
      ) => {
        return acc + (element.height || 0);
      }, 0);

      tooltipEl.style.opacity = "1";
      tooltipEl.style.maxHeight = `${(dataPoints.length * 20) + 30}`
      tooltipEl.style.left = `${chart.canvas.offsetLeft + tooltip.caretX}px`;
      tooltipEl.style.bottom = `${offsetBottom}px`
    })
    
  }
};

/**
 * Return datasets and emission values for use in the bottom half of <Overview /> component.
 * 
 * This function filters `logs` so that each log is only >= `mostRelevantYear`,
 * and then groups them by categories and subcategories for usage by the
 *  <OverviewBottomCharts /> component.
 * 
 * @param logs - The savior's logs to create charts from.
 * @param  mostRelevantYear - The most recent year with data returned from `getEmissionsByYear`,
 * and drawn by the `<EmissionsByYearBar />` chart.js `<canvas>`. 
 * This function filters `logs` so that each log is only >= this year. 
 * @returns the filtered logs, their emissions per category - sorted in ascending order, 
 * an emissions per category per subcategories object, and the summed emissions of all the logs
 * after filtering.
 */
export const getBottomCharts = (logs: Logs, mostRelevantYear: number): BottomCharts => {
  let emissionsPerCategory: GroupedEmissions = {};
  const emissionsPerSubcategory: GroupedEmissions<GroupedEmissions> = {};
  const otherCategories = new Set();
  let totalEmissions = 0;
  let numCategories = 0;
  logs
  .filter(({ source_file }) => {
    return new Date(`${source_file.upload_date}Z`).getFullYear() === mostRelevantYear
  })
  .sort((a, b) => b.co2e - a.co2e)
  .map(({ ghg_category, co2e, activity }) => { 
    totalEmissions += co2e;
    let category = GHGCategoryToAbbreviatedName[ghg_category as keyof typeof GHGCategoryToAbbreviatedName];
    if (otherCategories.has(category)) {
      category = "Other";
    }
    else if (!emissionsPerCategory[category]) {
      numCategories++
      if (numCategories >= MAX_CATEGORIES) {
        otherCategories.add(category);
        category = "Other";
      };
      emissionsPerCategory[category] = 0;
      emissionsPerSubcategory[category] = {};
    };
    emissionsPerCategory[category] += co2e;
    emissionsPerSubcategory[category][activity] = (emissionsPerSubcategory[category][activity] || 0) + co2e;
  }); 

  emissionsPerCategory = Object.fromEntries(
    Object.entries(emissionsPerCategory)
    .filter(([, co2e]) => co2e)
    .sort(([, co2eA], [, co2eB]) => co2eA - co2eB)
  );

  return { emissionsPerCategory, emissionsPerSubcategory };
}

export const PER_CATEGORY_CHART_PADDING = 60
/**
 * Renders the dataset value on the side of the bars (since it's a horizontal bar chart).
 */
export const emissionsPerCategoryBarValues = {
  id: "showBarValues",
  afterDatasetDraw: function (chart: Chart<"bar">, args: any, options: any) {
    const { ctx, width } = chart;
    ctx.fillStyle = softGrey;
    ctx.font = `${options.fontSize} monospace`;
    args.meta.data.map((
      bar: BarElement & {$context: { raw: number }}
    ) => {
      const barValue = bar.$context.raw;
      ctx.fillText(formatCO2e(barValue), width - PER_CATEGORY_CHART_PADDING, bar.y);
    });

  },
  defaults: {
    fontSize: "1em"
  }
};

const MAX_SUBCATEGORIES = MAX_CATEGORIES;
/**
 * Creates a dataset from an object with keys of subcategories of a savior's top emitting
 * categories and values of their respective emissions.
 * 
 * 
 * This is used by `<SubcategoriesDoughnut />` to render a chart for
 * the subcategories of the 'most emitting` category of a savior. 
 * 
 * @param emissionsPerSubcategory - The object containing subcategories and their emissions.
 * @param categoryName - The name of the category whose subcategories were provided.
 * @returns Containg the labels and data to render the chart with.
 */
export const getSubcategoriesDoughnut = (
  emissionsPerSubcategory: GroupedEmissions
) => {
  
  const data = Object.values(emissionsPerSubcategory);
  const labels = [];
  const totalCategoryEmissions = sumArray(data);
  let numSubcategories = 0;
  const createLabel = (category: string, categoryEmissions: number) => (
    `${category} ${((categoryEmissions / totalCategoryEmissions) * 100).toFixed(2)}%`
  );
  
  let otherEmissions = 0;
  Object.keys(emissionsPerSubcategory).map((categoryName) => { 
    numSubcategories += 1;
    if (numSubcategories >= MAX_SUBCATEGORIES) {
      otherEmissions += emissionsPerSubcategory[categoryName];
    } else {
      labels.push(createLabel(categoryName, emissionsPerSubcategory[categoryName]));
    };
  });

  if (otherEmissions > 0) {
    labels.push(createLabel("Other", otherEmissions))
    data.push(otherEmissions);
  };

  return { labels, data };
};