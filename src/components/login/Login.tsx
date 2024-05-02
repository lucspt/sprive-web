import { FormEvent, useContext, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { SaviorContext } from "../../contexts/savior/SaviorContext"
import "./Login.css";
import { BaseInput } from "../inputs/base/BaseInput";
import { AccountCredentials, LoginProps } from "./types";
import { SaviorContextValues } from "../../contexts/savior/types";

/**
 * A component to login to an account 
 * 
 * @param props 
 * @param props.className - A class to give the container element
 * @param props.navOnSuccess - Whether or not to perform a navigation on sucess
 * @param props.redirectPath - Where to redirect on login success, if `props.navOnSuccess` is true
 * 
 * @returns A login form component
 */
export function Login({ 
  className="", 
  navOnSuccess=true, 
  redirectPath="/saviors/overview" 
}: LoginProps) {

  const nav = useNavigate();
  const { state }: { state: string } = useLocation();
  
  const { login }: { login: Function } = useContext(SaviorContext) as SaviorContextValues;
  const [ error, setError ] = useState<string>("");
  const [ form, setForm ] = useState<AccountCredentials>({email: "", password: ""});
  
  function onSubmit(e: FormEvent<HTMLFormElement>) {
    login(
      e, () => navOnSuccess ? nav(redirectPath) : null, setError
    );
  };

  function onChange(fieldName: string, e: FormEvent<HTMLInputElement>) {
    const { value } = e.target as HTMLInputElement;
    setForm((prev) => ({...prev, [fieldName]: value}));
  }

  return (
    <div className={`login${error ? " error" : ""} ${className}`}>
      <form 
        className="form" 
        onSubmit={onSubmit}
      >
        <div className="form error-rel">
        <BaseInput
          onChange={(e): void => onChange("email", e)}
          id="email"
          inputClass="rounded-input"
          type="text"
          name="email"
          label="Email"
          autoComplete="off"
        />
        <BaseInput 
          label="Password"
          id="password"
          onChange={(e) => onChange("password", e)}
          type="password"
          name="password"
          className="rounded-input"
        />
        {error && <span className="error" data-testid="login-error">{ error }</span>}
        </div>
        <div className="form" style={{ gap: "unset" }}>
          <button 
            type="submit" 
            className="submit default-btn" 
            data-testid="login-button"
            disabled={!Object.values(form).every(x => x)}
          >
            Login
          </button>
          <div className="extras">

          <Link to="/signup" state={state}>Create an account</Link>
        </div>
        </div>
      </form>
    </div>
  )
}