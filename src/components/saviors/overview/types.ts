import { ChartJsDataset, GroupedEmissions, Logs } from "../../../types";

export type EmissionsPerSubcategory = GroupedEmissions<GroupedEmissions>;
export type EmissionsPerCategory = GroupedEmissions;

export interface EmissionsByYearData {
  labels: string[],
  datasets: ChartJsDataset[],
  yearTotalEmissions: GroupedEmissions
};

export interface BottomCharts {
  emissionsPerCategory: EmissionsPerCategory
  emissionsPerSubcategory: EmissionsPerSubcategory,
};

export interface EmissionsPerCategoryProps {
  data: number[],
  labels: string[],
  barDelay?: number
};

export interface OverviewBottomChartsProps {
  yearToFilterLogs: number, 
  headerCreator: Function,
  logs: Logs
}

export interface SubcategoriesDoughnutProps {
  emissionsPerSubcategory: GroupedEmissions,
  categoryName: string,
};