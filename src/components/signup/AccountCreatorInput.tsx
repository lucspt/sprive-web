import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { BaseInput } from "../inputs/base/BaseInput";
import { AccountCreatorInputProps } from "./types";
import { SpriveResponse } from "../../types";

/**
 *  Input component for meant for usage in AccountCreator.
 * 
 * Renders a jsx input along with a continue button to continue to the next form step
 * @param props
 * @param props.name - The input's name
 * @param props.onChange - The onChange event to assign the the input
 * @param props.onContinue - A function to call when the continue button is clicked
 * @param props.validation - A function that takes the input value as it's only argument 
  * and returns a boolean indicating if the value is valid to continue with
 * @param props.validateBeforeContinue - Whether or not to validate the input value before continuing to next form step
 * @param props.validationEndpoint - Only relevant for email input. A validationEndpoint to optionally make a request to 
  * check if an email is available for usage
 * @param props.label - The text to render a label with
 * @param props.errorMessage - An error message to display when validation fails
 * @param props.showButton - Whether or now to show the continue button
 * @param props.setHasError - setState function to update when the input value's validility status changes
 * 
 * @returns A div containing a BaseInput component with a button that triggers`onContinue` prop
*/
export default function AccountCreatorInput({ 
  name,
  onChange=() => null, 
  onContinue=() => null, 
  validation=() => true, 
  validateBeforeContinue, 
  validationEndpoint,
  label,
  errorMessage,
  showButton,
  setHasError,
  ...props
}: AccountCreatorInputProps) {

  const [ value, setValue ] = useState("");
  const [ error, setError ] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  function _onChange(e: ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setValue(val);
    onChange(val);
  };

  /**
   * function to validate the input value.
   * Only called if `validateBeforeContinue` prop is truthy
   * @param onContinue - A function to call when the validation is successful
   */
  async function validate(onContinue: Function) {
    let res: Response | SpriveResponse<{is_available: boolean}> = await fetch(`${validationEndpoint}/${value}`);
    res = await res.json() as SpriveResponse<{is_available: boolean}>;
    if (res.content.is_available) {
      setHasError(false)
      setError(false);
      onContinue();
    } else {
      setError(true);
      setHasError(true);
    }
  }

  useEffect(() => {
    if (showButton && ref.current) {
      ref.current.focus();
    }
  }, [showButton, ref])

  /**
   * onClick handler of continue button.
   * Validate and continue to next form step if valid, otherwise set an error.
   */
  function _onContinue() {
    if (validation(value)) {
      if (validateBeforeContinue) {
        validate(() => onContinue(value));
      } else {
        setHasError(false)
        setError(false);
        onContinue(value);
      }
    } else {
      setHasError(true);
      setError(true);
      ref.current?.focus();
    }
  };

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      _onContinue();
    }
  };

  return (
    <div className="input-container">
      <BaseInput
        id={name}
        name={name}
        value={value}
        label={label}
        onChange={_onChange}
        ref={ref}
        onKeyDown={onKeyDown}
        {...props}
      />
      {
        error && 
          <span className="error" data-testid="input-error">
            {errorMessage !== undefined ? errorMessage : `That ${name} is invalid or already in use` }
          </span>
      }
      {
        showButton && 
        <div className="continue-btn">
          <button
            type="button"
            onClick={_onContinue}
            >
            Continue
            <span className="material-symbols-rounded">arrow_right</span>
          </button>
        </div>
      }
    </div>
  )
}