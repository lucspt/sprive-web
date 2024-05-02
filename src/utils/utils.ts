/**
 * Utilities and helper functions providing commonly used functions in one place
 */
import { allowHeaders } from "../constants";
import { DynamicObject, Log, Logs, SpriveResponse } from "../types";
import { kgsInGt, kgsInMt, kgsInTon } from "./constants";
import { 
  FilterLogsForRelevantDateOpts,
  FetchWithAuthOptions,
  FormatCO2eOptions,
  FormatCO2eResponse,
  MergeObjectsResult,
} from "./types";

/**
 * Capitalize the first letter of a string.
 * 
 * @param string string - The string to capitalie
 * @returns The capitalized `string`.
 */
export const capitalize = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Retrieve a browser 3cookie
 * 
 * @param string key - The key of the cookie to retrieve
 * @returns The cookie's value if it exists, otherwise `undefined`
 */
export const getCookie = (key: "csrf_access_token"): string | undefined => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${key}=`);
  if (parts.length === 2) return parts?.pop()?.split(";").shift();
}

/** 
 * Perform a `fetch` call to an endpoint that requires authorization.
 * 
 * @param endpoint - The endpoint to fetch, this function prepends http://localhost:8000 to this value.
 * @param method - The method to fetch with.
 * @param options - Options for customizing this functions implementation.
 * @param options.body - A fetch request's body.
 * @param options.headers - Fetch headers.
 * @param options.responseMethod - The method to call when the response is returned i.e. response["json"]().
 * @param options.fetchOptions - Any extra key-value pairs to include in the fetch's request initializer.
 * @param options.isFileUpload - Whether or not the fetch is performing a file upload.
 * @param options.stringifyBody - Whether to `JSON.stringify()` `body`, if it is present.
 * @param options.setState - a state setter function to call with the response result once `responseMethod` has been called.
 * @param options.onUnauthorized - A function to call when the response returns a 401 status code.
 * @returns The fetch response after calling `options.responseMethod` on it.
 * This is likely an object containing a 'content' key, holding the data requested by the fetch. 
*/
export const fetchWithAuth = async (
  endpoint: string, 
  options: FetchWithAuthOptions = {},
): Promise<SpriveResponse | Response | void> => {
  // for (let [ k, v ] in Object.entries(defaultFetchOptions)) {
  //   if (!options.hasOwnProperty(k)) options[k] = v;
  // };
  try {
    const auth = getCookie("csrf_access_token");
    // if (auth === undefined) {
    //   throw Error; 
    // };
    
    const { 
      responseMethod="json",
      body={},
      headers: _headers={},
      fetchOptions={},
      isFileUpload=false,
      setState=() => null,
      onUnauthorized=(_: any) => null,
      stringifyBody=true,
      method="GET",
    } = options;
    
    const headers = new Headers({
      "Content-Type": "application/json",
      "X-CSRF-TOKEN": auth as string,
      "Access-Control-Allow-Origin": "http://localhost:3000",
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Headers": allowHeaders,
      ..._headers,
    });
    
    if (isFileUpload) {
      // for some reason, file POST's are not working with this header present
      // even when set to multipart/form-data
      headers.delete("Content-Type");
    };
    
    const fetchOpts: RequestInit = {
      headers, 
      credentials: "include",
      method,
      ...fetchOptions,
    }
    
    if (method !== "GET" && !isObjectEmpty(body)) {
      fetchOpts.body = stringifyBody ? JSON.stringify(body) : body;
    };
    
    const request = new Request(`http://localhost:8000/${endpoint}`, fetchOpts);
    let response: Response | SpriveResponse = await fetch(request);
    if (response.ok) {
      response = await response[responseMethod]() as SpriveResponse;
      setState(response);
      return response;
    } else if (response.status === 401) {
      onUnauthorized(response)
    }
    return response

  } catch (e) {
    console.error(e);
  };

};

/**
 * Helper function to see if the current app user is logged in
 * 
 * @param savior - The `savior` object provided by SaviorContext.
 * @returns The user's jwt token if logged in, otherwise false.
 */
export const isLoggedIn = (savior: Object): string | false => {
  const token = getCookie("csrf_access_token");
  if (token && !isObjectEmpty(savior)) {
    return token;
  } return false;
};

/**
 * Check if an object is empty.
 * 
 * @param obj - The object in question.
 * @returns A boolean indicating the result.
 */
export const isObjectEmpty = (obj: Object): boolean => {
  for (let _ in obj) return false; return true
};

/**
 * Format a co2e value, which is inferred to be an amount of kilograms
 * into the most suitable scaled value, and return its abbreviated metric after the scaling.
 * If the resulting number is an integer, it will return an integer, even if `maximumFractionDigits` > 1.
 * 
 * **Note the return value of this function before usage!**
 * @example
 * returns "1 t"
 * formatCO2e(907.18474) // This is roughly how many kilograms are in 1 ton
 * 
 * @example
 * returns [ "1", "t" ];
 * formatCO2e(907.18474, { stringify: false })
 * @param co2e - The CO2e value.
 * @param options - Optional. An options object to customize the return value.
 * @param options.maximumFractionDigits - Optional. An integer specifiying how many decimal places the limit the number to.
 * @param options.stringify - Optional. Whether to stringify the return value
 * @returns A **string** or an **array of strings** where the first element is the scaled form of `co2e`, and the second is its metric
 */
export function formatCO2e<RT extends boolean = true>(co2e: number, options?: FormatCO2eOptions<RT>): FormatCO2eResponse<RT> {
  const { maximumFractionDigits=3, stringify=true } = (options || {});
  if (isNaN(co2e)) {
    const res = stringify ? "0 kg" : [ "0", "kg" ];
    return res as FormatCO2eResponse<RT>
  };
  const metrics = [
    {metric: "t", scaleBy: kgsInTon},
    {metric: "Mt", scaleBy: kgsInMt},
    {metric: "Gt", scaleBy: kgsInGt}
  ];

  let resultVal = co2e,
  resultMetric = "kg";

  for(let i = 0; i < 3; i++) {
    const { metric, scaleBy } = metrics[i];
    const scaled = co2e / scaleBy;
    if (scaled >= 1) {
      resultVal = scaled;
      resultMetric = metric;
    } else break;
  };

  const formattedVal = Intl.NumberFormat(
    "default", { maximumFractionDigits }
  ).format(resultVal);
  const res =  stringify ? `${formattedVal} ${resultMetric}` : [ formattedVal, resultMetric ];
  return res as FormatCO2eResponse<RT>
};

/**
 * Create an array containing range of numbers 
 * 
 * @param start - The value to start from.
 * @param stop - The value to stop at.
 * @param step - The increment. Defaults to 1.
 * @returns The number range.
 */
export function arrayRange(start: number, stop: number, step=1) {
  return Array.from(
    { length: (stop - start) / step + 1 },
    (_, index) => start + index * step
    );
};

export const sumArray = (array: number[]): number => {
  return array.reduce((acc, val) => acc + val, 0);
};

const __default_filter_options = { 
  onlyProcessed: true,
  filters: (_: Log) => true,
};
/**
 * Helper function to filter logs so that those remaining are the most relevant logs 
 * with respect to the date that a savior joined. On top of the date filter, the logs
 *  will be filtered so that only those that have a co2e value remain. 
 * 
 * For example, if a savior joined last year, it will return all logs that have a co2e value.
 * If the savior joined in year 2020, and the current year is 2024, the logs will be filtered so
 * that only those from 2020 - 2023, (with co2e values of type "number") remain.
 * 
 * @param logs - The savior's logs.
 * @param dateSaviorJoined - A `Date` parsable string or `Date` of when the savior joined.
 * @param options - Implementation options.
 * @param options.onlyProcessed - Whether to only filter logs that contain co2e values of type "number".
 * @param options.filters - A function to call for additional filters when calling the `filter()` method on `logs`.
 * @returns The resulting logs.
 */
export const filterLogsForRelevantDate = (
  logs: Logs,
  dateSaviorJoined: string | Date,
  options: FilterLogsForRelevantDateOpts = __default_filter_options
): Logs => {
  dateSaviorJoined = new Date(dateSaviorJoined);
  const yearJoined = dateSaviorJoined.getFullYear();
  const now = new Date();
  const currentYear = now.getFullYear();
  /*
  If the partner has joined before the current year, we only display 
  data based upon previous years.
  */
 options = {...__default_filter_options, ...options};
 const _baseFilter = (log: Log) =>  {
  if (options.onlyProcessed && (typeof log.co2e !== "number")) return false;
  return true;
};

 let filterFn = (log: Log) => _baseFilter(log);

  if (currentYear - yearJoined > 3) { 
    const dateLt = new Date(currentYear - 1, 11, 31);
    const dateGt = new Date(currentYear - 3, 0, 1);
    filterFn = log => {
      const logDate = new Date(`${log.source_file.upload_date}Z`);
      return _baseFilter(log) && (logDate > dateGt && logDate < dateLt);
    };
}
return logs.filter(filterFn);
}

export const mergeObjects = <T, K extends string, S>(
  target: T,
  source: S
): MergeObjectsResult<T, K, S> => {
  const merged = Object.assign({}, target as DynamicObject<any>);

  Object.entries(source as DynamicObject<any>).map(([ k, v ]) => {
    if (typeof v === "object" && !Array.isArray(v)) {
      merged[k] = mergeObjects(merged[k] || {}, v);
    } else {
      merged[k] = v;
    };
  });
  return merged as MergeObjectsResult<T, K, S>;
};