import { arrayRange } from "../../../utils/utils";
import { darker, ecoNeutral, softGrey } from "../../visualization/constants";

export const DEFAULT_POINT_RADIUS = 4.5;
export const REDUCTION_OVERLAP_RADIUS = DEFAULT_POINT_RADIUS * 2;

const REDUCTION_CHART_PROPS = (color: string) => ({
  pointStyle: "circle",
  pointHoverRadius: 10,
  pointRadius: DEFAULT_POINT_RADIUS,
  pointBorderWidth: 2,
  pointBackgroundColor: darker,
  pointBorderColor: color,
  borderColor: color,
  backgroundColor: color,
});

/**
 * Function to handle when datapoints overlap.
 * Resizes them accordingly so that they are all visible.
 */
export function handleOverlappingChartPoints(
  ctx: { raw: number }, datasets: number[], onOverlapSize: number
) {
  const dataPoint = ctx.raw;
  if (datasets.includes(dataPoint)) {
    return onOverlapSize;
  }
  return DEFAULT_POINT_RADIUS;
};

// same as arrayRange util, but renders it as an object with label, value keys for <DropdownPicker /> usage.
export const getDropdownPickerValues = (start: number, stop: number, step=1) => {
  return Array.from(
    { length: (stop - start) / step + 1 },
    (_, index) => {
      const value = start + index * step
      return {label: value, value};
    }
  );
};

/**
 * Simulate a reduction scenario.
 * Given a percentage, a value to start from, and the number of data points to generate,
 * this function simulates a reduction scenario, driving down emissions at a steady rate
 * w.r.t `numPoints` to generate.
 * 
 * @param reductionPct - The reduction percentage
 * @param startFrom - The emissions amount to start from.
 * @param numPoints - The number of data points to return.
 * @returns An array of numbers, containing the data points of simulated emissions.
 */
const simulateReduction = (reductionPct: number, startFrom: number, numPoints: number) => {
  const length = numPoints - 1;
  const interval = reductionPct / length;
  const res = Array.from({ length }, (_, i) => {
    const pctToReduce =  interval * (i + 1)
    return startFrom - (startFrom * pctToReduce) / 100
  });
  return [startFrom, ...res];
};


/**
 * Creates a reduction chart given a savior's average emissions per year for a scope,
 * the base year to start from, the forecast year to end with and a reduction percent value.
 * 
 * @param scopeYearlyAverageEmissions - The average emissions per year of the scope.
 * @param baseYear - The year to start from.
 * @param forecastYear - The year to end the simulation by.
 * @param reductionPercentage - The percentage to reduction scope emissions by the time of `forecastYear`.
 * 
 * @returns An object containing labels and datasets to render a chart.js line chart with, 
 * simulating a reduction scenario. The labels are the years, the datasets contain the data values.
 */
export const createReductionChart = (
  scopeYearlyAverageEmissions: number,
  baseYear: number,
  forecastYear: number,
  reductionPercentage: number
) => {
  const currentYear = new Date().getFullYear();
  const labels = arrayRange(baseYear, forecastYear);
  const yearlyAvgMultiple = (baseYear - currentYear) + 1;
  let startFromEmissions;
  if (yearlyAvgMultiple >= 1) {
    startFromEmissions = scopeYearlyAverageEmissions * yearlyAvgMultiple;
  } else {
    startFromEmissions = Math.max(
      0, scopeYearlyAverageEmissions - (scopeYearlyAverageEmissions * Math.abs(yearlyAvgMultiple))
    );
  };
  const businessUsualDatapoints = labels.map(
    (_, i) => (i + 1) * (startFromEmissions || scopeYearlyAverageEmissions)
  );
  const reductionSimulation = simulateReduction(
    reductionPercentage, businessUsualDatapoints[0], businessUsualDatapoints.length
  );
  const datasets = [
    {
      ...REDUCTION_CHART_PROPS(softGrey),
      data: businessUsualDatapoints,
      label: "Business as usual"
    },
    {
      ...REDUCTION_CHART_PROPS(ecoNeutral),
      label: "Reduction forecast",
      pointRadius: (ctx: { raw: number }) => handleOverlappingChartPoints(
        ctx, businessUsualDatapoints, REDUCTION_OVERLAP_RADIUS
      ),
      data: reductionSimulation,
      // fill: {
      //   target: "-1",
      //   below: GAP_COLOR
      // }
    }
  ];

  return { labels: labels.map(x => `${x}`), datasets };

}