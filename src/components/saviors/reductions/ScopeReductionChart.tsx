import { useState } from "react";
import { isObjectEmpty } from "../../../utils/utils";
import { Visualization } from "../../visualization/Visualization";
import { Header } from "../../header/Header";
import Slider from "rc-slider";
import 'rc-slider/assets/index.css';
import DropdownPicker from "../../inputs/picker/DropdownPicker";
import { getDropdownPickerValues, createReductionChart } from "./utils";
import { ScopeReductionChartProps } from "./types";
import { YTickFormatter } from "../../visualization/utils";

/**
 * Creates a savior's scope reduction chart. The chart which let's them
 * simulate a reduction scenario given a start year, end year, and reduction 
 * percentage. 
 * 
 * Soon to be with pledges incorporated to visualize their impact???
 * 
 * 
 * @param props 
 * @param props.scopeYearlyAverageEmissions - The yearly average emissions of the scope.
 * @param props.defaultReductionPct - The reduction percentage to first load the chart with.
 * @param props.scope - The emissions scope.
 * @param props.minBaseYear - The earliest year that the savior measured data for this scope.
 * 
 * @returns The reduction chart component
 */
export function ScopeReductionChart({ 
  scopeYearlyAverageEmissions, 
  defaultReductionPct=30, 
  scope, 
  minBaseYear
 }: ScopeReductionChartProps) {
  const currentYear = new Date().getFullYear();
  const DEFAULT_FORECAST_YEAR = currentYear + 10;
  const [ forecastYear, setForecastYear ] = useState<number>(DEFAULT_FORECAST_YEAR);
  const [ reductionPercentage, setReductionPercentage ] = useState<number>(defaultReductionPct);
  const [ baseYear, _ ] = useState<number>(Math.max(minBaseYear, currentYear - 1));
  const data = createReductionChart(
    scopeYearlyAverageEmissions, baseYear, forecastYear, reductionPercentage
  );
  const formatter = new YTickFormatter(scopeYearlyAverageEmissions);

  function resetChart() {
    setForecastYear(DEFAULT_FORECAST_YEAR);
    setReductionPercentage(defaultReductionPct);
  }

  const possibleForecastYears = getDropdownPickerValues(
    currentYear + 1, Math.max(2050, currentYear + 20), 1
  );
  // const possibleBaseYears = getDropdownPickerValues(minBaseYear, possibleForecastYears.at(-2).value);
  return !isObjectEmpty(data) && (
    <div className="chart-container">
      {/* <DropdownPicker 
        label="Base year"
        className
        values={possibleBaseYears} 
        value={baseYear} 
        onChange={(choice) => setBaseYear(choice)}
      /> */}
    <div className="reduction-chart">
      <div className="top">
        <Header text={`Total scope ${scope} emissions target`} fontSize="med"/>
        <span className="faded-text subtitle">Reduce your total scope {scope} emissions {reductionPercentage}% by 
          <DropdownPicker 
            values={possibleForecastYears} 
            defaultValue={forecastYear}
            value={forecastYear}
            onChange={(choice: number) => setForecastYear(choice)}
          />
          <button className="reset" onClick={resetChart}>Reset chart</button>
        </span>
      <div className="slider-container">
        <span className="slider-tick min">1%</span>
        <span className="slider-tick max">100%</span>
        <Slider 
          min={1}
          max={100} 
          step={1}
          defaultValue={20} 
          value={reductionPercentage}
          onChange={(val) => setReductionPercentage(val as number)}
          className="reduction-slider"
          styles={{
            track: { backgroundColor: "var(--eco-neutral)" },
            rail: { backgroundColor: "var(--primary-color)" },
            handle: { 
            backgroundColor: "var(--eco-neutral)", 
            boxShadow: "none", 
            borderColor: "var(--eco-neutral)", 
            opacity: 1,
            borderWidth: 0
          },
          }}
          dots={false}
        />
      </div>
      </div>
      <Visualization
        dataTestId="reduction-chart"
        ariaLabel={`Your scope ${scope} reduction plan`}
        type="line"
        id="scope-one-two-pledge"
        key={(forecastYear + baseYear)}
        data={data}
        options={{
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                display: true,
              },
              ticks: {
                stepSize: (data.datasets[0]?.data?.at(-1) || 100) / 2,
                callback: (value) => {
                  return formatter.format(value, { withMetric: true })
                }
              },
            }
          },
          plugins: {
            legend: {
              position: "bottom",
              align: "start",
              labels: {
                borderRadius: 2,
                useBorderRadius: true,
                boxWidth: 10,
                boxHeight: 10,
              }
            }
          },
        }}
      />
    </div>
    </div>
  )
}