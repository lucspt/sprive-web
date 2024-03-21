import { useContext, useMemo, useRef, useState } from "react";
import { redirect, useFetcher } from "react-router-dom"
import { fetchData } from "../../../utils";
import KaizenPledgeForm from "./KaizenPledgeForm"
import EmissionFactors from "../factors/EmissionFactors"
import ReformationPledgeForm from "./ReformationPledgeForm";
import ZenithPledgeForm from "./ZenithPledgeForm"
import { SaviorContext } from "../../../contexts/SaviorContext";
import "./PledgeCreator.css"

export const createPledge = async ({ request }) => {
  let formData = await request.formData();
  formData = Object.fromEntries(formData);
  formData.value = Number(formData.value);
  formData.recurring = JSON.parse(formData.recurring);
  const numberKeys = [];
  if (formData.recurring) {
    numberKeys.push("frequency_value");
  }
  if (formData.type === "reformation") {
    numberKeys.push("_value");
    numberKeys.map(x => numberKeys.push(`_${x}`));
  } 
  if (numberKeys) {
    numberKeys.map(x => {
        const numberValue = formData[x]
        if (numberValue) formData[x] = Number(numberValue)
      }
    )
  }
  const res = await fetchData("saviors/pledges", "POST", formData);
  return redirect(`../${res.content}`);
}

const PledgeCreator = function PledgeCreator() {

  const fetcher = useFetcher();
  const [ pledgeType, setPledgeType ] = useState("");
  const [ activity, setActivity ] = useState({activity: "", activity_unit_type: ""});
  const [ choosingFactor, setChoosingFactor ] = useState(false);
  const [ isRecurring, setIsRecurring ] = useState(false);
  const formRef = useRef();
  const { savior: { username } } = useContext(SaviorContext);


  const forms = useMemo(() => {
    const { activity: _activity } = activity;
    return {
      "kaizen": <KaizenPledgeForm 
        activity={_activity} 
        setChoosingFactor={setChoosingFactor}
        formRef={formRef}
        isRecurring={isRecurring}
      />,
      "reformation": <ReformationPledgeForm
        factor={activity} 
        setFactor={setActivity}
        setChoosingFactor={setChoosingFactor}
        formRef={formRef}
        isRecurring={isRecurring} 
      />,
        "zenith": <ZenithPledgeForm />
    }
  }, [activity, choosingFactor, formRef, isRecurring])

  const getFactor = factor => {
    setActivity(factor);
    setChoosingFactor(false);
  }

  return (
    <div className="pledge-creator">
      {
        pledgeType ? 
        <>
          {
            choosingFactor &&
              <EmissionFactors
                needsUnitType={true}
                returnFactor={factor => getFactor(factor)}
                backButton={() => setChoosingFactor(false)}
              />
          }
          <div className="container" style={{ display: choosingFactor ? "none" : "flex" }}>
            <button 
              style={{alignSelf: "flex-start", marginBottom: 30 }}
              className="pink-hov"
              onClick={() => setPledgeType("")}
              >
              <span className="material-symbols-rounded">arrow_back</span>
            </button>
            <header>
              <h3>{pledgeType} pledge</h3>
            </header>
            <fetcher.Form 
              ref={formRef} 
              method="POST" 
              action="." 
              className="creation form"
              >
              <input type="hidden" value={pledgeType} name="type"/>
              <input type="hidden" value={isRecurring} name="recurring"/>
              <input 
                name="unit_type" 
                readOnly
                type="hidden"
                value={activity.activity_unit_type}
                />
              {forms[pledgeType]}
            </fetcher.Form>
          </div>
        </>
        :
        <div className="type-choices">
          <div className="heading">
            <h2>make a pledge, {username}</h2>
            <div className="invitation">
              <span 
                style={{color: "var(--soft-grey)"}}
              >
                what kind of pledge would you like to create?
              </span>
              <span className="switch-container">
                this {isRecurring ? "will" : "will not"} be a recurring pledge
                <button className="switch-input" 
                  onMouseUp={e => {
                    setIsRecurring(prev => !prev)
                    e.target.classList.toggle("active")
                  }}
                  >
                    <div className="bg" />
                    <div className="circle" />
                </button>
              </span>
            </div>
          </div>
          <div className="pledge-types">
            <div className="type widget">
              <span className="title">kaizen pledge</span>
              <p className="description">
                make a pledge to phase out an emitting activity
              </p>
              <button className="default-btn"
                onClick={() => setPledgeType("kaizen")}
              >
                create
              </button>
            </div>
            <div className="type widget">
            <span className="title">reformation pledge</span>
            <p className="description">
              make a pledge to replace an emitting activity with a more sustainable one
            </p>
              <button className="default-btn"
                onClick={() => setPledgeType("reformation")}
              >
                create
              </button>
            </div>
            <div className="type widget">
            <span className="title">zenith pledge</span>
            <p className="description">
              make a pledge to adopt a new sustainable practice
            </p>
              <button className="default-btn"
              onClick={() => setPledgeType("zenith")}
              >
                create
              </button>
            </div>
          </div>
        </div>
     }
    </div>
  )
}

export default PledgeCreator