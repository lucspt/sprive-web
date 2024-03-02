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

export const formatRequest = (method="GET",  body={},  headers={},) => {
  headers = {
    ...headers,
    "Content-Type": "application/json",
    "X-CSRF-TOKEN": getCookie("csrf_access_token"),
    "Access-Control-Allow-Origin": "http://localhost:3000",
    "Access-Control-Allow-Credentials": true,
    "Access-Control-Allow-Headers": allowHeaders
  };
  const request = {
    method: method,
    headers: headers, 
    credentials: "include"
  };
  
  if (!isObjectEmpty(body)) {
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
  ) => {
    try {
      headers = {
        ...headers,
        "Content-Type": "application/json",
        "X-CSRF-TOKEN": getCookie("csrf_access_token"),
        "Access-Control-Allow-Origin": "http://localhost:3000",
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Headers": allowHeaders
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
      response = await response.json();

      if (response.ok) {
        if (setState) {
          setState(response.content);
        } else return response;
      }
    }
    catch (e) {
      console.log(e);
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

export const formatCO2e = (val) => {
  if (isNaN(val)) return [ 0, "kg" ];
  const kgsInTon = 907.18474;
  const formatVal = val => Intl.NumberFormat(
    window.navigator.langauge, {maximumFractionDigits: 1}
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
    return [ formatVal(val / result.val), result.metric ];
  }
  return val > kgsInTon ? _format() : [ formatVal(val), "kg" ];
}
