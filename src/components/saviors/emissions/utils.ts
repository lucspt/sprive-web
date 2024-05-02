import { Logs } from "../../../types";

/**
 * Creates a csv file for `<EmissionsByScopeTable />` downloadable by an `<a>` tag.
 * 
 * @param logs - The data to create a csv from
 * @returns A string to pass to an `<a>` tag href.
 */
export const logsToCsv = (logs: Logs) => {
  const COLUMNS = [
    "Date", 
    "Scope", 
    "GHG Category", 
    "Activity", 
    "Value", 
    "Unit", 
    "CO2e"
  ];
  let csvData = logs.map(
    ({ source_file, activity, value, unit, co2e, scope, category, ghg_category }) => {
      const date = new Date(source_file.upload_date).toLocaleString(
        "default",
        { month: "2-digit", day: "numeric", year: "numeric" }
      );
     return [
        date, 
        scope, 
        (ghg_category || "N/A"), 
        category, 
        activity, 
        value, 
        unit, 
        co2e
      ].join(",")
    }
  ).join("\n");
  csvData = [COLUMNS, csvData].join("\n");
  return `data:text/csv;charset=utf-8, ${csvData}`;
};

/** 
 * Creates a filename for the csv. 
 * 
 * @returns The start year - end year of the logs suffixed with 'Emissions.csv'. 
 * See `logsToCsv` for more
*/
export const createCsvFilename = (logs: Logs) => {
  const dates = Array.from(
    logs, ({ source_file }) => new Date(source_file.upload_date).getFullYear()
  );
  const timeFrame = `${Math.min(...dates)} - ${Math.max(...dates)}`;
  return `${timeFrame} Emissions.csv`;
}

export function turnDateStringToSortable(dateStr: string) {
  /*
    This will take a date such as 3/2024 and join it to 32024 so that it can 
    be sorted inside the component

    This way we have bar chart sorted by date ascending from ltr
  */ 
  return Number(dateStr.split("/").join(""));
}