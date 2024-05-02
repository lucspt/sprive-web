import { memo } from "react";
import { useLoaderData, useSearchParams } from "react-router-dom";
import "./Reductions.css"
import { Header } from "../../header/Header";
import { ScopeReductionChart } from "./ScopeReductionChart";
import { NoData } from "../../common/NoData";
import { DataTable } from "../../table/DataTable";
import { PledgeCreatorButton } from "./PledgeCreatorButton";
import { LoaderResponse } from "./types";

/**
 * The component which renders the app's /saviors/reductions route.
 * 
 * Create and visualize customizable reduction scenarios, 
 * where a savior makes pledges, and can simulate the impact of them.
 * 
 * Renders scope 1 & 2, as well as a scope 3 'reduction' chart.
 * These charts simulate a reduction scenario, given a customizable
 * percentage, base year and end year, input by the user.
 * 
 * Also renders a table of the savior's pledges for the current reduction scenario
 * along with these charts.
 * 
 * @returns A react component.
 */
export const Reductions = memo(function Reductions() {
  const [ searchParams, setSearchParams ] = useSearchParams();
  const { 
    logs,
    scopeOneAndTwo, 
    scopeThree, 
    scopeOneAndTwoTitle,
    scopeOneAndTwoMinBaseYear,
    scopeThreeMinBaseYear,
   } = useLoaderData() as LoaderResponse;

   const tabButtonProps = (tabId: string) => {
    return {
      onClick: () => setSearchParams(prev => ({...prev, tab: tabId})),
      className: `tab-btn${searchParams.get("tab") === tabId ? " active" : ""}`
    };
  };

  const shouldRenderChart = (scopeEmissions: unknown) => {
    return typeof scopeEmissions === "number" && !isNaN(scopeEmissions);
  };

  return (
    <div className="reductions page">
      <Header text="Reductions" />
      {logs?.length > 0 
      ? (
          <>
            <div className="tabs">
              <button {...tabButtonProps("1")}>Tab 1</button>
              <button {...tabButtonProps("2")}>Tab 2</button>
              <button {...tabButtonProps("3")}>Tab 3</button>
              <button className="create">
                <span className="material-symbols-rounded white-hov">add</span>
              </button>
            </div>
            <section className="charts">
                {shouldRenderChart(scopeOneAndTwo) && 
                  <ScopeReductionChart 
                  scopeYearlyAverageEmissions={scopeOneAndTwo} 
                  scope={scopeOneAndTwoTitle}
                  minBaseYear={scopeOneAndTwoMinBaseYear}
                  />
                }
                {shouldRenderChart(scopeThree) && 
                  <ScopeReductionChart
                    scopeYearlyAverageEmissions={scopeThree as number}
                    scope="3"
                    minBaseYear={scopeThreeMinBaseYear}
                  />
                }
            </section>
          </>
        ) : (
          <NoData title="No footprint measured yet" subtitle="Measure your first activity to make a reduction plan"/>
        )
      }
      <section data-testid="pledges-table">
        <DataTable 
          columns={["Name", "Description", "Estimated impact" ]}
          TitleComponent={
            <Header text="Pledges" className="table-header" style={{ fontSize: "1.1em" }}>
              { logs.length > 0 && <PledgeCreatorButton /> }
            </Header>
          }
          noData={true}
          >
            <></>
        </DataTable>
      </section>
    </div>
    )
  })
