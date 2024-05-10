import { memo } from "react"
import "./Emissions.css"
import { NoData } from "../../common/NoData";
import { EmissionsByScopeTable } from "./EmissionsByScopeTable"
import { EmissionsByScopeDoughnut } from "./EmissionsByScopeDoughnut"
import { MonthlyEmissionsBar } from "./MonthlyEmissionsBar"
import { Header } from "../../header/Header"
import { useEmissions } from "../../../hooks/emissions/useEmissions";

/**
 * The component that renders the app's '/saviors/emissions' route.
 */
export const Emissions = memo(function Emissions() {
  const { doughnut, barChart, table, logsToDownload } = useEmissions();

  return (
  <div className="emissions page">
      <Header text="Emissions" />
      {
        Object.values(table).some(x => x.totalCO2e > 0) ? (
          <>
            <div className="charts">
              <EmissionsByScopeDoughnut emissionsByScope={doughnut}/>
              <MonthlyEmissionsBar emissionsByMonth={barChart} />
            </div>
            <section>
              <EmissionsByScopeTable emissionsByScope={table} logs={logsToDownload}
              />
            </section>
          </>
        ) : <NoData />
      }
    </div>
  )
})