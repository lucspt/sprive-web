import { redirect, useFetcher, useLocation, useNavigate } from "react-router-dom"
import ValidatedInput from "./ValidatedInput"
import DropdownInput from "./DropdownInput"
import { useContext, useEffect, useMemo, useState } from "react";
import { SaviorContext } from "../contexts/SaviorContext";
import { allowHeaders } from "../utils";

const AccountCreator = () => {
  const [ name, setName ] = useState({firstName: "", lastName: ""});
  const [ step, setStep ] = useState(1);
  const [ error, setError ] = useState("");
  const { state: redirectPath } = useLocation();
  const [ email, setEmail ] = useState("");
  const { setSavior } = useContext(SaviorContext);
  const nav = useNavigate();

  const createAccount = async form => {
    form.preventDefault();
    const _formData = new FormData(form.target);
    const { firstName, lastName, ...formData } = Object.fromEntries(_formData.entries());
    let res = await fetch("http://localhost:8000/partners", {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "http://localhost:3000",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Headers": allowHeaders
      },
      credentials: "include"
    });
    const json = await res.json();
    const { content } = json;
    if (res.ok) {
      setSavior(content);
      nav(redirectPath || "/");
    } else {
      setError(content);
    }
  }

  const validateEmail = async () => {
    let res = await fetch(`http://localhost:8000/partners/emails/${email}`);
    res = await res.json();
    if (res.content.is_available) {
      setStep(2);
    } else {
      setError("That email is already in use");
    }
  }

  return (
    <div className="create-account">
      <form 
        onSubmit={e => createAccount(e)}
        // method="POST" 
        // action={`/accounts/create?redirect=${redirectPath || "/"}`} 
      >
        <div className="input-field">
          <label htmlFor="email" 
            style={{display: step === 1 ? "flex" : "none"}}
          >
            email
          </label>
          <input
            className="transparent-input"
            id="email"
            style={{ display: step === 1 ? "flex" : "none", backgroundColor: "transparent"}}
            label="email"
            name="email"
            onChange={e => {setEmail(e.target.value); setError("")}}
            type="email"
            />
        </div>
        {step === 1 && 
        <>
        {
          error && 
            <span style={{
              backgroundColor: "var(--eco-danger)", 
              padding: "10px 15px",
              marginBottom: 5
              }}>
              That email is already in use
            </span>
        }
          <button
            disabled={!email || error}
            type="button"
            className="default-btn"
            style={{alignSelf: "flex-end"}}
            onClick={validateEmail}
            >
            continue
          </button>
        </>
        }
        {/* <input type="hidden" name="name" value={Object.values(name).join(" ")} />
        <ValidatedInput
          style={{ display: step === 2 ? "flex" : "none" }}
          label="first name"
          name="firstName"
          message="enter your first name!"
          onChange={e => setName(prev => {return {...prev, firstName: e.target.value}})}
        />
        <ValidatedInput
          label="last name"
          name="lastName"
          style={{ display: step === 2 ? "flex" : "none" }}
          onChange={e => setName(prev => {return {...prev, lastName: e.target.value}})}
          message="enter your last name!"
        />
        {step === 2 && 
          <button 
            type="button" 
            style={{ alignSelf: "flex-end" }}
            className="default-btn" 
            disabled={!(name.firstName && name.lastName)}
            onClick={() => setStep(3)}
          >
            continue
          </button>
        } */}
        <ValidatedInput
          name="username"
          label="company name"
          onChange={() => setError("")}
          message="enter your company's name"
          style={{ display: step === 2 ? "flex" : "none" }}
        />
        <ValidatedInput
          name="password"
          label="password"
          type="password"
          message="enter a password"
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
        <>
        { error && 
          <span style={{
            backgroundColor: "var(--eco-danger)", 
            padding: "10px 15px",
            marginBottom: 5,
            textWrap: "nowrap"
            }}>
              That company name is already in use
          </span>
          }
          <button 
            type="submit" 
            disabled={Boolean(error)}
            className="default-btn"
            style={{alignSelf: "flex-end"}}
            >
            create account
          </button>
          </>
        }
      </form>
    </div>
  )
}

export default AccountCreator