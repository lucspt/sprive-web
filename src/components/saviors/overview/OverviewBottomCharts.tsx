import { useRef } from "react";
import { Header } from "../../header/Header";
import { EmissionsPerCategory } from "./EmissionsPerCategory";
import { SubcategoriesDoughnut } from "./SubcategoriesDoughnut";
import { getBottomCharts } from "./utils";
import { useIsElementInViewport } from "../../../hooks/common/useIsElementInViewport";
import { OverviewBottomChartsProps } from "./types";

/**
 * 
 * @param props
 * @param props.logs - The array of logs to create datasets from
 * @param props.headerSinceData - A string that specifies the starting and ending dates of the logs, 
 * will be used to render a header for this component
 * @param props.yearToFilterLogs - The most relevant year with emissions data, since the savior 
 * started their climate program. Usually either the year they joined, or the last full year of measurements
 * This component uses a util that will filter those logs so that each log >= the year.
 * @returns The bottom half of <Overview />
 */
export function OverviewBottomCharts({ logs, headerCreator, yearToFilterLogs }: OverviewBottomChartsProps) {

  let { emissionsPerCategory, emissionsPerSubcategory } = getBottomCharts(logs, yearToFilterLogs);

  const chartsRef = useRef<HTMLSpanElement>(null);
  const renderCharts = useIsElementInViewport(
    chartsRef, {
      observerOptions: { threshold: 1.0, rootMargin: "10px" },
    }
  );

  const categoriesData = Object.values(emissionsPerCategory);
  const categoriesLabels: string[] = Object.keys(emissionsPerCategory);
  let PER_CATEGORY_HEADER = categoriesLabels.slice(0, 3);
  const numCategories = PER_CATEGORY_HEADER.length;
  const topEmittingCategory = categoriesLabels.at(-1) as string;
  
  return headerCreator && (
    <section className="overview-bottom">
    <div className="desc">
      <Header text="Emissions per category" fontSize="med" />
      <p className="p-desc">{ headerCreator(PER_CATEGORY_HEADER, numCategories) } </p>
    </div>
    <span ref={chartsRef} id="vis-threshold" data-testid="overview-bottom-charts-visibility"/>
      <div className="bottom-charts">
    {renderCharts && 
      <div className="charts">
        <EmissionsPerCategory
          data={categoriesData}
          labels={categoriesLabels}
        />
        <SubcategoriesDoughnut
          emissionsPerSubcategory={emissionsPerSubcategory[categoriesLabels.at(-1) as string]}
          categoryName={topEmittingCategory}
        />
      </div>
    }
    </div>
  </section>
  )
}