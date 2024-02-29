import { useFetcher, useLocation } from "react-router-dom"
import ValidatedInput from "./ValidatedInput"
import DropdownInput from "./DropdownInput"
import { useEffect, useState } from "react";


export const createAccount = async ({ request }) => {
  let _formData = await request.formData();
  const { firstName, lastName, ...formData } = Object.fromEntries(_formData.entries())
  let res = fetch("http://localhost:8000/saviors", {
    method: "POST",
    body: formData,
    headers: {"Content-Type": "application/json"}
  })
  res = await res.json()
  if (res.ok) {
    const url = new URL(request.url)
    const redirect = url.searchParams.get("redirect")
    return redirect(redirect)
  } else {
    throw new Error("oops...that did not work")
  }
}

const NextBtn = ({ setStep, nextStep, disabled }) => (
    <button 
    type="button" 
    style={{ alignSelf: "flex-end" }}
    className="default-btn" 
    disabled={disabled}
    onClick={() => setStep(nextStep)}
  >
    next
  </button>
)
const AccountCreator = () => {
  const fetcher = useFetcher();
  const [ name, setName ] = useState({firstName: "", lastName: ""})
  const [ step, setStep ] = useState(1)
  const { state: redirectPath } = useLocation()
  
  useEffect(() => {
    console.log(name, Object.values(name).join(" "))
  }, [name])
  return (
    <div className="create-account">
      <fetcher.Form 
        method="POST" 
        action={`/accounts/create?redirect=${redirectPath || "/"}`} 

      >
        <input type="hidden" name="name" value={Object.values(name).join(" ")} />
        <ValidatedInput
          style={{ display: step === 1 ? "flex" : "none" }}
          label="first name"
          name="firstName"
          message="enter your first name!"
          onChange={e => setName(prev => {return {...prev, firstName: e.target.value}})}
        />
        <ValidatedInput
          label="last name"
          name="lastName"
          style={{ display: step === 1 ? "flex" : "none" }}
          onChange={e => setName(prev => {return {...prev, lastName: e.target.value}})}
          message="enter your last name!"
        />
        {step === 1 && 
          <NextBtn nextStep={2} setStep={setStep} disabled={!(name.firstName && name.lastName)}/>
        }
        <ValidatedInput
          name="username"
          label="username"
          message="choose your username"
          style={{ display: step === 2 ? "flex" : "none" }}
        />
        <DropdownInput
          name="region"
          values={["US"]}
          label="region"
          submitOnClick={false}
          submitOnEmpty={false}
          style={{ display: step === 2 ? "flex" : "none" }}
          inputClass="transparent-input"
        />
        {step === 2 && 
          <button 
            type="submit" 
            className="default-btn"
            style={{alignSelf: "flex-end"}}
          >
            create account
          </button>
        }
      </fetcher.Form>
    </div>
  )
}

export default AccountCreator