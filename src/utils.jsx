export const getWindowSize = () => {
  if (window.innerWidth > 900) {
    return "large";
  } else if (window.innerWidth >= 700) {
    return "medium";
  } else {
    return "small";
  }
}

export const getCookie = key => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${key}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

export const allowHeaders = [
  "Content-Type",
  "Access-Control-Allow-Origin",
  "Access-Control-Allow-Headers",
  "Access-Control-Allow-Credentials"
].join(", ")

export const getFetchHeaders = (headers={},) => ({
  "X-CSRF-TOKEN": getCookie("csrf_access_token"),
  "Access-Control-Allow-Origin": "http://localhost:3000",
  "Access-Control-Allow-Credentials": true,
  "Access-Control-Allow-Headers": allowHeaders,
  ...headers
});

export const formatRequest = (method="GET",  body={},  headers={}, forceBody=false) => {
  headers = {
    "Content-Type": "application/json",
    "X-CSRF-TOKEN": getCookie("csrf_access_token"),
    "Access-Control-Allow-Origin": "http://localhost:3000",
    "Access-Control-Allow-Credentials": true,
    "Access-Control-Allow-Headers": allowHeaders,
    ...headers,
  };
  const request = {
    method: method,
    headers: headers, 
    credentials: "include"
  };
  
  if (forceBody || !isObjectEmpty(body)) {
    request.body = JSON.stringify(body);
  } 
    return request;
}

export const fetchData = async (
  endpoint,
  method="GET",
  body={},
  headers={},
  setState=null,
  statusCodeCheck=null,
  onStatusCodeMatch = () => null,
  onNotOk=() => null,
) => {
  try {
    headers = {
      "Content-Type": "application/json",
      "X-CSRF-TOKEN": getCookie("csrf_access_token"),
      "Access-Control-Allow-Origin": "http://localhost:3000",
      "Access-Control-Allow-Credentials": true,
      "Access-Control-Allow-Headers": allowHeaders,
      ...headers,
    };
    const options = {
      method: method,
      headers: headers, 
      credentials: "include"
    };
    if (!isObjectEmpty(body)) {
      options.body = JSON.stringify(body);
    }
    let response = await fetch(`http://localhost:8000/${endpoint}`, options);
    if (response.status === statusCodeCheck) {
      return onStatusCodeMatch();
    } else if (response.ok) {
      response = await response.json();
      if (setState) {
        setState(response.content);
      } return response;
    } onNotOk(response);
  }
  catch (e) {
    throw e;
  }
}

export const isObjectEmpty = (obj) => {for (let k in obj) return false; return true};

export const windowSize = getWindowSize();

export const aggregationToChart = (aggregationResult, label) => {

  const [ labels, datasets ] = [[], []];

  aggregationResult.map(x => {
    labels.push(x._id);
    datasets.push(x.data);
  })

  return {
    "labels": labels,
    "datasets": {
      "data": data,
      "label": label 
    }
  };
}

// export const objToParams = ( object ) => {
  
//   let params = []

//   for (let [k, v] of Object.entries(object)) {
//     console.log(k, v, "loop")
//     switch (typeof(v)) {
//       case "string": {
//         params.push(`${k}=${v}`)
//         break
//       }
//       case "object": {
//         params.push(`${k}=${JSON.stringify(v)}`)
//         break
//       }
//     }
//   }
//   return params.join("&")
// }

export const formatCO2e = (val, nDecimals=1) => {
  if (isNaN(val)) return [ 0, "kg" ];
  const kgsInTon = 907.18474;
  const formatVal = val => Intl.NumberFormat(
    window.navigator.langauge, {maximumFractionDigits: nDecimals}
  ).format(val);
  const _format = () => {
    const megatonsInTon = 1000000;
    const gigatonsInTon = 1102311310.9244;
    const metrics = [
        {metric: "t", val: kgsInTon},
        {metric: "Mt", val: megatonsInTon},
        {metric: "Gt", val: gigatonsInTon}
    ];
    let result = metrics[0];
    while (((val / result.val) >= 1) && metrics.length > 1) {
      const next = metrics[1];
      if (val / next.val >= 1) {
        metrics.shift();
        result = next;
        continue;
      } else break;
    }
    return [ formatVal(val / result.val, nDecimals), result.metric ];
  }
  return val > kgsInTon ? _format() : [ formatVal(val, nDecimals), "kg" ];
}

export const formToObj = formTarget => {
  let formData = new FormData(formTarget);
  formData = Object.fromEntries(formData.entries());
  return formData;
};

const emissionsPerMonthAgg =  {
  "filters": [
    {"$match": {"co2e": {"$exists": true}}},
    {"$group": {
          "_id": {
              "month": {"$month": "$created"},
              "year": {"$year": "$created"},
          },
          "co2e": {"$sum": "$co2e"}
      },
    },
    {"$sort": {"_id.year": -1, "_id.month": -1}},
    {"$limit": 28}
  ],
  "collection": "logs",
  "query_type": "aggregate",
}


const monthMappings = {
  1: "january", 2: "february", 3: "march", 4: "april", 5: "may", 6: "june",
  7: "july", 8: "august", 9: "september", 10: "october", 11: "november",
}

export const getEmissionsByDate = async (waterfall=false) => {
  const res =  await fetchData("saviors/data", "POST", emissionsPerMonthAgg);
  let { content: barChart } = res;
  let currentYear, labels;
  if (!waterfall) barChart = barChart.reverse();
  if (barChart.length === 1) {
     labels = [monthMappings[barChart[0]._id.month]];
  } else {
    labels = barChart.map((x, i) => {
      const { _id, _id: { month, year } } = x;
      if (waterfall || (i !== 0 && month !== 12 && currentYear === year)) {
        return monthMappings[month];
      } else {
        currentYear = year ;
        return `${month}/${year}`;
      }
    })
  }
  return waterfall ? {
    "labels": labels,
    "data": Array.from(barChart, x => x.co2e),
    
  }
  : {
    "labels": labels,
    "data": Array.from(barChart, x => x.co2e),
    "originalLabels": Array.from(barChart, x => x._id),
  };
}
