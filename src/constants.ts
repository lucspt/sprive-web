export const ACCEPTED_FILES = [
  ".csv",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
].join(", ");

export const allowHeaders = [
  "Content-Type",
  "Access-Control-Allow-Origin",
  "Access-Control-Allow-Headers",
  "Access-Control-Allow-Credentials"
].join(", ")

// Headers needed when creating a request that requires cookies to be included
export const fetchHeadersIncludeCookies = {
  "Access-Control-Allow-Origin": "http://localhost:3000",
  "Access-Control-Allow-Credentials": "true",
  "Access-Control-Allow-Headers": allowHeaders,
}

// A ghg category as a string to it's respective name
export const GHG_CATEGORY_NAMES = {
  '3.1': 'Purchased goods and services',
  '3.2': 'Capital goods',
  '3.3': 'Fuel and energy related activities',
  '3.4': 'Upstream transportation and distribution',
  '3.5': 'Waste generated in operations',
  '3.6': 'Business travel',
  '3.7': 'Employee commuting',
  '3.8': 'Upstream leased assets',
  '3.9': 'Downstream transportation and distribution',
  "3.10": "Processing of sold products",
  '3.11': 'Use of sold products',
  '3.12': 'End-of-life treatment of sold products',
  '3.13': 'Downstream leased assets',
  '3.14': 'Franchises'
};

// Abbreviated ghg categories go here, see above for more.
export const GHGCategoryToAbbreviatedName = {
  ...GHG_CATEGORY_NAMES,
  "3.1": "Goods & services",
}