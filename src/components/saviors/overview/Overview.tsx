/**
 * Root component handling /saviors/overview page
 */

import { memo } from "react";
import { Header } from "../../header/Header";
import "./Overview.css"
import { EmissionsByYearBar } from "./EmissionsByYearBar";
import { NoData } from "../../common/NoData";
import { OverviewBottomCharts } from "./OverviewBottomCharts";
import { useOverview } from "../../../hooks/useOverview";
import { OverviewData } from "../../../hooks/types";

/**
 * Component that renders the full overview page at /saviors/overview route.
 * 
 * @returns A react component
 */
export const Overview = memo(function Overview() {
  const { 
    logs, 
    bottomChartsHeaderCreator,
    mostRelevantYear,
   } = useOverview() as OverviewData;

   const { length: numLogs } = (logs || []);
   
  return ( 
    <div className="full-space overview page">
      <Header text="Overview" />
      { numLogs > 0 
      ? ( 
      <>
        <section className="overview-main">
          <div className="main-chart">
            <EmissionsByYearBar logs={logs} />
          </div>
        </section>
        <div className="seperator" />
        <OverviewBottomCharts 
          logs={logs} 
          headerCreator={bottomChartsHeaderCreator}
          yearToFilterLogs={mostRelevantYear}
         />
      </>
      ) : <NoData />
      }
  </div> 
  )
})