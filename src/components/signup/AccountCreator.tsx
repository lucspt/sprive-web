import {  useNavigate } from "react-router-dom"
import { FormEvent, useContext, useRef, useState } from "react";
import { SaviorContext } from "../../contexts/savior/SaviorContext";
import "./AccountCreator.css";
import AccountCreatorInput from "./AccountCreatorInput";
import MeasurementsApplication from "./MeasurementsApplication";
import { SaviorContextValues } from "../../contexts/savior/types";
import { emailRegex } from "./constants";

const partnersEndpoint = `http://localhost:8000/partners`
/**
 * Component to create a new account
 * 
 * @returns A multi step form
 */
export const AccountCreator = () => {

  const [ step, setStep ] = useState(1);
  const { setSavior } = useContext(SaviorContext) as SaviorContextValues;
  const nav = useNavigate();
  const [ hasError, setHasError ] = useState<{[key: string]: boolean}>({
    email: false,
    password: false,
    company_name: false,
    measurement_categories: false,
    region: false,
  });
  const ref = useRef<HTMLFormElement>(null);
  const [ formData, setFormData ] = useState({
    email: "",
    password: "",
    measurement_categories: [],
    company_name: "",
    region: "US"
  });

  const _hasError = Object.values(hasError).some(x => x);

  /**
   * function to create the account. Used as `onSubmit` of the form element.
   * @param props
   * @param props.e - The form element
   * @returns- React component
   */
  async function createAccount(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (_hasError) return;
    const form = new FormData(ref.current as HTMLFormElement);
    const account = {
      ...Object.fromEntries(form.entries()),
      ...formData,
      username: formData.company_name
    };
    let res = await fetch(
      partnersEndpoint, {
        method: "POST", 
        body: JSON.stringify(account),
        headers: { "Content-Type": "application/json"}
      }
    );
      const json = await res.json();
      const { content } = json;
      if (res.ok) {
        setSavior(content);
        nav("/saviors/overview");
      } else if (res.status === 409) {
        // setError(content);
      }
  };


  function onContinue(nextStepNum: number) {
    setStep(prev => Math.max(prev, nextStepNum));
  };

  // common input props; see AccountCreatorInput for more
  const inputProps = (_step: number, name: string) => ({
    showButton: step === _step,
    type: "text",
    setHasError: (bool: boolean) => setHasError(prev => ({...prev, [name]: bool})),
    name,
    onContinue: () => onContinue(_step + 1),
    onChange: (val: string) => setFormData(prev => ({...prev, [name]: val})),
    autoFocus: true,
    value: formData[name as keyof typeof formData],
  });

  return (
    <div className="create-account full-space">
      <form 
        onSubmit={createAccount}
        className={`step-${step}`}
        ref={ref}
      >
        {step === 1 ? (
          <AccountCreatorInput
            {...inputProps(1, "email")}
            name="email" 
            validateBeforeContinue 
            validation={(email: string) =>  Boolean(email && emailRegex.test(email))}
            label="Enter your company email"
            validationEndpoint={`${partnersEndpoint}/emails`}
          />
          ) : step === 2 ? (
            <AccountCreatorInput
              {...inputProps(2, "company_name")}
              name="company_name"
              validation={(companyName: string) => Boolean(companyName && companyName !== "")}
              errorMessage=""
              label="Enter your company name"
            />
          ) : step === 3 ? (
          <AccountCreatorInput
            {...inputProps(3, "password")}
            label="Choose a password"
            errorMessage=""
            validation={(password: string) => Boolean(password && password !== "")}
            type="password"
          />
          )
        : (
          <MeasurementsApplication setFormData={setFormData} chosen={formData.measurement_categories}/>
        )
        }
      </form>
    </div>
  )
};