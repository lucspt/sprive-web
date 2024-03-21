import { useCallback, useEffect, useRef, useState } from "react"
import { useFetcher, useLoaderData, useNavigate } from "react-router-dom"
import { fetchData } from "../utils"
import DropdownInput from "./DropdownInput"



export const P = ({}) => {

  const nav = useNavigate();

  return (
    <div className="tab data">
      <div className="content">
        <div className="quick-actions widget">
          <div className="actions-list">
            <div className="action">
              <span>collect and measure</span>
              <button 
                className="default-btn"
                onClick={() => nav("upload")}
              >
                import data
              </button>
            </div>
            <div className="action">
              <span>visualize and report</span>
              <button 
                className="default-btn" 
                onClick={() => nav("plots")}
              >
                create dashboard
              </button>
            </div>
            <div className="action">
              <span>respond and take action</span>
              <button 
              className="default-btn"
                onClick={() => nav("/saviors/pledges/create")}
              >
                  make pledge
              </button>
            </div>
            <div className="action">
              <span>expand and revolutionize</span>
              <button 
                className="default-btn"
                onClick={() => nav(".")}
              >
              inform peers
            </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


// we also have this for a learn section

export const S = function S() {

  const topic = useLoaderData()
  
  return (
    <div>learn more {topic} </div>
  )
}

export const testSPT = async ({ request }) => {
  let formData = await request.formData()
  formData = Object.fromEntries(formData.entries())
  const res = await fetch("http://localhost:8000/saviors/test-celery", {
    method: "POST", body: JSON.stringify(formData), headers: {"Content-Type": "application/json"}
  })

  console.log(res)

  return null
}

export const SPT = function SPT() {

  const [ inputVal, setInputVal ] = useState("")

  const _min = useCallback((d0, d1, d2, bx, ay) => (
    d0 < d1 || d2 < d1 
      ? d0 > d2
        ? d2 + 1
        : d0 + 1
      : bx === ay
        ? d1 
        : d1 + 1
  ), [])

  const levenshtein = useCallback((a, b) => {
    if (a === b) return 0;

    if (a.length > b.length) {
      const tmp = a;
      a = b;
      b = tmp;
    }

    let la = a.length 
    let lb = b.length 

    while (la > 0 && (a.charCodeAt(la - 1) === b.charCodeAt(lb - 1))) {
      la--;
      lb--;
    }

    let offset = 0

    while (offset < la && (a.charCodeAt(offset) === b.charCodeAt(offset))) {
      offset++;
    }

    la -= offset;
    lb -= offset 

    if (la === 0 || lb < 3) {
      return lb;
    }

    let x = 0;
    let y, d0, d1, d2, d3, dd, dy, ay, bx0, bx1, bx2, bx3;

    const vector = [];

    for (y = 0; y < la; y++) {
      vector.push(y + 1)
      vector.push(a.charCodeAt(offset + y))
    }

    let len = vector.length - 1

    for (; x < lb - 3;) {
      bx0 = b.charCodeAt(offset + (d0 = x))
      bx1 = b.charCodeAt(offset + (d1 = x + 1))
      bx2 = b.charCodeAt(offset + (d2 = x + 2))
      bx3 = b.charCodeAt(offset + (d3 = x + 3))
      dd = (x += 4)
      for (y = 0; y < len; y += 2) {
        dy = vector[y]
        ay = vector[y + 1]
        d0 = _min(dy, d0, d1, bx0, ay);
        d1 = _min(d0, d1, d2, bx1, ay);
        d2 = _min(d1, d2, d3, bx2, ay);
        dd = _min(d2, d3, dd, bx3, ay);
        vector[y] = dd;
        d3 = d2;
        d2 = d1;
        d1 = d0;
        d0 = dy;
      }
    }

    for (; x < lb;) {
      bx0 = b.charCodeAt(offset + (d0 = x));
      dd = ++x;
      for (y = 0; y < len; y += 2) {
        dy = vector[y];
        vector[y] = dd = _min(dy, d0, dd, bx0, vector[y + 1])
        d0 = dy
      }
    }
    return dd
  }, [])

  return (  
    <form style={{padding: 90}}>
      <DropdownInput
        inputVal={inputVal}
        setInputVal={setInputVal}
        values={["plastic", "clothing", "hello", "123", "456", "7", "8", "9", "10", "1234"]}
      />
    </form>
  )
}


export const _SPT = () => {
  const [ res, setRes ] = useState(null)
  useEffect(() => {
    const test = async () => {
      const res = await fetchData("saviors/test/lovelife", "GET")
      setRes(res.content)
    }

    test()
  }, [])

  return (
    <div>
      { res }
    </div>
  )
}


export const T = function T() {

  const [ emissionsScope, setEmissionsScope ] = useState(1)
  return (
    <div className="take-actions">
      <header>
        <h2>scope {emissionsScope}</h2>
      </header>
      <div className="spacing">
        <div className="layout">
        <div className="top-row widgets-row" style={{gap: "29px"}}>
      <div className="top-left" style={{flex: 2, maxWidth: 475}}>
        <div className="widget large" style={{"width": "100%", maxWidth: "800px"}}>
          <ul className="action-list">
            <div className="action">
              <div className="bullet-point"></div>
                <li className="item">contact a supplier</li>
            </div>
            <div className="action">
              <div className="bullet-point"></div>
                <li className="item">switch to renewable energy</li>
            </div>
            <div className="action">
              <div className="bullet-point"></div>
                <li className="item">contact a supplier</li>
            </div>
            <div className="action">
              <div className="bullet-point"></div>
                <li className="item">contact a supplier</li>
            </div>
          </ul>
        </div>
        </div>
        <div className="top-right">
          <div className="squares">
            <div className="widget square">widget</div>
            <div className="widget square">widget</div>
          </div>
          <div className="long" style={{width: "100%", height: "100%"}}>
            <div className="widget capsule">widget</div>
          </div>
        </div>
      </div>
      <div className="rating-bar">
        <div className="progress-bg">
        <div className="progress"></div>
        </div>
        <span className="grade">A+</span>
      </div>
      </div>
    </div>
  </div>
    )
}