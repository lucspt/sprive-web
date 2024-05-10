import { ChartJsDataset } from "../../types";
import { kgsInMt, kgsInTon } from "../../utils/constants";
import { formatCO2e } from "../../utils/utils";

const metricToScaleValue = {
  "kg": 1,
  "t": kgsInTon,
  "Mt": kgsInMt,
  "Gt": kgsInMt,
};

/**
 * A class that will infer the best metric to utilize for a `<Visualization />` component.
 * 
 * Construct this class with the chartjs datasets, a number or an array of chart data,
 * and it will find the best metric to use. Then, call the `format` method in 
 * `chart.options.scales.<scale to format>.ticks.callback` with the value of the tick 
 * and it will scale the dataset values to the same metric.
 */
export class YTickFormatter {
  currentMetric: null | string;
  scaleValue: number;
  numFormatter: Intl.NumberFormat;

  constructor(
    initData?: number | ChartJsDataset[] | ChartJsDataset,
    formatOptions?: Intl.NumberFormatOptions
  ) {
    let maxData = initData;
    if (typeof initData === "object") {
      if (Array.isArray(initData)) {
        maxData = Math.max(
          ...Array.from((initData as ChartJsDataset[])
          .map(({ data }) => Array.isArray(data) ? Math.max(...data) : data))
        )
      } else {
        maxData = Array.isArray(initData.data) ? Math.max(...initData.data) : initData.data;
      }
    } else if (typeof maxData !== "number") {
      throw Error("You must provide chart datasets or a base value or to intialize formatter");
    };

    this.currentMetric = formatCO2e(maxData, { stringify: false })[1];
    this.scaleValue = metricToScaleValue[this.currentMetric as keyof typeof metricToScaleValue];
    this.numFormatter = new Intl.NumberFormat("default", formatOptions || { maximumFractionDigits: 1} );
  };

  /**
   * This method scales a value to the correct metric with respect to the data
   * it was instantiated with. 
   * 
   * @param value - The number to scale.
   * @param withMetric - Whether to add the metric to the resulting string
   * @returns The formatted value as a string
   */
  format(value: string | number, options: { withMetric: boolean }): string | number {
    const { withMetric = false } = options;
    if (typeof value === "number") {
      console.log(value, this.scaleValue);
      const res = this.numFormatter.format(value / this.scaleValue);
      if (withMetric) {
        return `${res} ${this.currentMetric}`
      } else {
        return res;
      }
    } 
    return value;
  }
};