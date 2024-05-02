import { Logs, SpriveResponse } from "../../../types";
import { fetchWithAuth } from "../../../utils/utils";
import { LoaderEmissionsPerScope, LoaderScopeObject } from "./types";

/**
 * The loader for /saviors/reductions route. 
 * 
 * Currently, it gathers and formats the data needed in order
 * to create reduction charts given the scenario being 
 * interacted with. 
 * 
 * @returns An object containing keys:
 * - `scopeOneAndTwo`: The savior's scope 1 & 2 yearly average emissions.
 * - `scopeThree`: The savior's scope 3 yearly average emissions.
 * - `logs`: The savior's logs.
 * - `scopeOneAndTwoTitle`: The title to render the scope 1 & 2 reduction chart with.
 * it will either be scope 1 & 2 target, or just one of those scopes if no data for the other was used.
 * - `scopeThreeMinBaseYear`: The minimum base year to render as an option of the `<DropdownPicker />`, 
 * on the scope 3 chart. The earliest year that recorded data for the scope.
 *  - `scopeOneAndTwoMinBaseYear`: same a `scopeThreeMinBaseYear`, but for the scope 1 & 2 chart.
 */
export async function reductionsLoader() {
  const res = await fetchWithAuth("saviors/logs") as SpriveResponse<Logs>;
  const scopeOne: LoaderScopeObject = { co2e: null, years: new Set() };
  const scopeTwo: LoaderScopeObject = { co2e: null, years: new Set() };
  let scopeThree: LoaderScopeObject | number = { co2e: null, years: new Set() };
  const logs = res.content;
  const emissionsPerScope: LoaderEmissionsPerScope  = { "1": scopeOne, "2": scopeTwo, "3": scopeThree };
  logs.map(({ scope, co2e, source_file }) => {
    if (!co2e) return;
    emissionsPerScope[scope].years.add(new Date(`${source_file.upload_date}Z`).getFullYear());
    emissionsPerScope[scope].co2e! += co2e;
  });

  const scopeOneYears = scopeOne.years;
  const scopeTwoYears = scopeTwo.years;
  const scopeThreeYears = scopeThree.years;
  const scopeOneAndTwo = ((scopeOne.co2e || 0) + scopeTwo.co2e!) / (scopeOneYears.size + scopeTwoYears.size);
  scopeThree = scopeThree.co2e! / scopeThree.years.size;
  const isScopeOneNull = scopeOne.co2e === null;
  const scopeOneAndTwoTitle = (
  !isScopeOneNull && !scopeTwo.co2e === null
      ? "1 & 2"
      : isScopeOneNull 
      ? "2"
      : "1"
  );
  return {
    scopeOneAndTwo, 
    scopeThree, 
    logs,
    scopeOneAndTwoTitle,
    scopeThreeMinBaseYear: Math.min(...scopeThreeYears),
    scopeOneAndTwoMinBaseYear: Math.min(...[...scopeOneYears, ...scopeTwoYears]),
  };
}