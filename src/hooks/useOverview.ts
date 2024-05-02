import { useContext } from "react";
import { useLoaderData } from "react-router-dom";
import { SaviorContext } from "../contexts/savior/SaviorContext";
import { categoryListToString } from "../components/saviors/overview/utils";
import { filterLogsForRelevantDate } from "../utils/utils";
import { SaviorContextValuesWithSavior } from "../contexts/savior/types";
import { PossiblyEmptyLogs } from "../types";
/**
 * A hook that prepares logs for rendering - and further dataset creation logic in the components
 * that make up - `<Overview />`
 * 
 * This hook will filter the logs returned by the /saviors/overview loader using `utils.filterLogsForRelevantDate`
 * so that only those with the most relevant dates remain. It also provides information on the 
 * most recent year containing data from the filtered logs, as well as a header creator function for 
 * <OverviewBottomCharts />
 * 
 * 
 * @returns The filtered logs, a function to create a header for the `<OverviewBottomCharts />` chart,
 * as well as the most recent year it filtered logs from. This will used to create the <EmissionsByYearBar /> chart. 
 * datasets. 
 */
export const useOverview = () => {
  
  const joined = (useContext(SaviorContext) as SaviorContextValuesWithSavior).savior.joined;
  let logs = useLoaderData() as PossiblyEmptyLogs;

  if (logs?.length === 0) return {};
  logs = filterLogsForRelevantDate(logs, joined);
  const dateJoined = new Date(joined);
  const yearJoined = dateJoined.getFullYear();
  const now = new Date();
  const currentYear = now.getFullYear();
  let bottomChartsHeaderCreator;
  const monthJoined = dateJoined.getMonth(),
  currentMonth = now.getMonth();
  let mostRelevantYear = currentYear;
  /*
  If the partner has joined before the current year, we only display 
  data based upon previous years.
  */
 /* v8 ignore start*/
  if (currentYear > yearJoined) { 
    bottomChartsHeaderCreator = (categories: string[], numCategories: number) => {
      const description = numCategories > 1 ?
        `${categoryListToString(categories)} were your biggest emitters`
        : `${categories[0]} was your biggest emitter`
      return `${description} during Jan-Dec ${currentYear - 1}`
    };
    mostRelevantYear = currentYear - 1;
  } else {
    bottomChartsHeaderCreator = (categories: string[], numCategories: number) => {
      const description = numCategories > 1 ?
        `${categoryListToString(categories)} are your biggest emitters`
        : `${categories[0]} is your biggest emitter`
      const since = currentMonth === monthJoined 
        ? "this month" 
        : `since ${dateJoined.toLocaleDateString("default", {month: "long", year: "numeric"})}`
      return `${description} ${since}`
    };
  };  
  /* v8 ignore stop */
  return { 
    logs,
    bottomChartsHeaderCreator, 
    mostRelevantYear
   };
}