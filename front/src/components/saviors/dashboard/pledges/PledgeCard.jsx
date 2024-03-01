import { useEffect, useState } from "react"
import { fetchData } from "../../../../utils"
import { useFetcher, useLoaderData } from "react-router-dom"
import { CardWidget } from "../../../Widgets"
import Visualization from "../../../Visualization"
import "./PledgeCard.css"
import ValidatedInput from "../../../ValidatedInput"


export const editPledge = async ({ request }) => {
  let formData = await request.formData();
  formData = Object.fromEntries(formData);
  let pledgeId;
  ({ pledgeId, ...formData } = formData);
  const res = await fetchData(`saviors/pledges/${pledgeId}`, "PUT", formData);
  if (res.ok) {
    return null;
  } else throw new Error("something went wrong..");
}

const PledgeCard = function PledgeCard() {
  const pledgeId = useLoaderData();
  const [ pledgeData, setPledgeData ] = useState({});
  const [ editing, setEditing ] = useState({popup: false, warnCancel: false});
  const fetcher = useFetcher();

  useEffect(() => {
    Promise.all([
      fetchData(`saviors/pledges/${pledgeId}`, "GET"),
      fetchData("saviors/data", "POST", {
        "query_type": "aggregate",
        "collection": "logs",
        "filters": [
          {
            "$group": {
              "_id": "$activity",
              "co2e": {"$sum": "$co2e"}
            },
          },
          {"$sort": {"co2e": -1}},
          {"$limit": 1}
        ]
      })
    ]).then(res => {
      console.log(res)
      setPledgeData({
        pledge: res[0].content,
        topEmitter: {"name": res[1].content[0]._id, "co2e": res[1].content[0].co2e}

      })
    });

  }, [])

  useEffect(() => {
    editing.popup && setEditing({popup: false, warnCancel: false});
    fetcher.formData && setPledgeData(prev => {
      return {
        ...prev,
        pledge: {...prev.pledge, ...Object.fromEntries(fetcher.formData)}
      }
    })
  }, [fetcher])

  const stopPledge = async () => {
    await fetchData(
      `saviors/pledges/${pledge._id}`, "PUT", {"status": "inactive"}
    )
    setPledgeData(prev => {
      return {
        ...prev,
        pledge: {...prev.pledge, "status": "inactive"}
      }
    });
    setEditing(prev => {return {...prev, warnCancel: false}});
  }

  const startPledge = async () => {
    await fetchData(
      `saviors/pledges/${pledge._id}`, "PUT", {"status": "active"}
    )
    setPledgeData(prev => {
      return {
        ...prev,
        pledge: {...prev.pledge, "status": "active"}
      }
    });
  }

  const { pledge, topEmitter } = pledgeData
  return pledge && (
    <div className="pledge-card">
      <header>
        <h2>{pledge.name}</h2>
      </header>
      <div className="top row info">
        <CardWidget 
          title="stars"
          infoDigit={pledge.stars}
        />
        <CardWidget 
          title="CO2e saved"
          co2e={pledge.co2e}
        />
        <CardWidget 
          title="date pledged"
          infoDigit={
            new Date(pledge.created).toLocaleDateString(
              undefined, {month: "2-digit", year: "2-digit"}
            )
          }
        />
      </div>
      <div className="middle row">
        <div>something here</div>
        <div>something here</div>
        <Visualization 
          style={{ maxWidth: 300, maxHeight: 290 }}
          type="polarArea"
          id={pledge.name}
          labels={[pledge.name, topEmitter.name]}
          datasets={[{
            data: [pledge.co2e, topEmitter.co2e],
            label: "total CO2e impact"
          }]}
          options={{
            plugins: {
              legend: {
                display: true,
                position: "bottom",
                align: "center",
              },
              title: {
                display: true,
                text: "compared to your most emitting activity",
                position: "bottom",
                font: {
                  size: 12
                }
              },
            },
            scales: {
              r: {
                ticks: {
                  color: "#fff",
                  showLabelBackdrop: false
                },
                grid: {
                  color: "#000"
                }
              }
            }
          }}
        />
      </div>
      <div className="bottom row" style={{ justifyContent: "flex-end" }}>
        <button className="default-btn edit" 
          onClick={() => setEditing(prev => {return {...prev, popup: true}})}
        >
          edit
        </button>
      </div>
      {editing.popup &&
        <div>
          <div className="edit-cover"
            onClick={() => setEditing(prev => {return {...prev, popup: false}})}
           >

           </div>
          <fetcher.Form 
            action="." 
            method="PUT" 
            className={`edit-popup${editing.warnCancel ? " warning" : ""}`}
          >
            <div>
              <button type="button" 
                onClick={
                  () => editing.warnCancel ? setEditing(
                    prev => {return {...prev, warnCancel: false}}
                  )
                  : setEditing(prev => {return {...prev, popup: false}})
                }
              >
                <span className="material-symbols-rounded">arrow_back</span>
              </button>
            </div>
            <div className="warning-popup">
              <span style={{ textWrap: "nowrap" }}>are you sure you want to cancel this pledge?</span>
              <div className="submit" style={{ justifyContent: "center" }}>
                <button 
                  className="default-btn" 
                  type="button"
                  style={{ marginBottom: 50, paddingBottom: "unset", width: 60 }}
                  onClick={stopPledge}
                >
                  yes
                </button>
              </div>
            </div>
            <ValidatedInput
              name="name"
              type="text"
              message="a pledge requires a name"
              defaultValue={pledge.name}
              className="rounded-input"
              label="name"
              />
            <div className="input-field" style={{position: "relative"}}>
              <label htmlFor="description" style={{paddingLeft: 7}}>description</label>
              <textarea 
                type="text"
                rows={6}
                id="description"
                style={{ padding: 15 }}
                defaultValue={pledge.description}
                name="description"
              />
            </div>
            <input type="hidden" name="pledgeId" value={pledge._id} />
            <div 
              className="submit form" 
              style={{justifyContent: pledge.recurring ? "space-between" : "flex-end"}}
            >
              {
                pledge.recurring &&
                <>
                {pledge.status === "active" ?
                  <button 
                    type="button"
                    onClick={() => setEditing(prev => {return {...prev, warnCancel: true}})}
                  >
                    <span
                      className="material-symbols-rounded" 
                      style={{ color: "var(--eco-danger)" }}
                    >
                      cancel
                    </span>
                    cancel pledge
                  </button>
                  : 
                  <button 
                    type="button"
                    onClick={startPledge}
                  >
                    <span
                      className="material-symbols-rounded" 
                      style={{ color: "var(--eco-great)" }}
                    >
                      recycling
                    </span>
                    activate pledge
                </button>
                }
                </>
              }
              <button className="default-btn" type="submit">save</button>
            </div>
          </fetcher.Form>
        </div>
      }
    </div>
  )
}

export default PledgeCard