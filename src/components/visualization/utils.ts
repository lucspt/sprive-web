import { ChartJsDataset } from "../../types";
import { kgsInMt, kgsInTon } from "../../utils/constants";
import { formatCO2e } from "../../utils/utils";

const metricToScaleValue = {
  "kg": 1,
  "t": kgsInTon,
  "Mt": kgsInMt,
  "Gt": kgsInMt,
};


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

  format(value: string | number, withMetric: boolean = false): string | number {
    if (typeof value === "number") {
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