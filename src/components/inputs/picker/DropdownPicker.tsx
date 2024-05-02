import { MouseEvent, useState } from "react";
import "./DropdownPicker.css"
import { DropdownPickerProps } from "./types";

/**
 * Renders a customized `<select>` like dropdown. 
 * 
 * Given values and their respective label, this picker component can be used
 * within a form as a button derived set of options to choose from.
 * 
 * @param props 
 * @param props.name - The name to give to the `<input>` element that's rendered.
 * @param props.values - A mapping with key's label and value, and their respective values,
 *  representing the options to display.
 * @param props.rounded - Gives the container a 'rounded-input' class.
 * @param props.buttonType - Passed to the button's rendered, if "submit" the picker will submit 
 * any forms wrapping it on click.
 * @param props.label - A label to render with the picker.
 * @param props.noneOption - Whether to display add a `None` option to `values`
 * @param props.noneOptionLabel - The label to use for `noneOption`
 * @param props.noneOptionValue - The value to use for `noneOption`
 * @param props.reactRef - A ref. Will be passed to the container `<div>` element.
 * @param props.required - Whether this picker should require a value to be chosen.
 * Only relevant if rendered inside a `<form>`
 * @param props.defaultValue - Give's the picker a default value.
 * @param props.onChange - A function to call that recieves the chosen value, when it is changed.
 * @param props.controlled - Whether or not to render a picker controlled by state.
 */
export default function DropdownPicker({
  name, 
  values, 
  value,
  rounded=true, 
  buttonType="button", 
  label,
  noneOption=false,
  noneOptionLabel="None",
  noneOptionValue=null,
  reactRef,
  required=false,
  defaultValue="",
  onChange,
  controlled,
  readOnly=false
}: DropdownPickerProps) {

  if (!values) return;
  // const [ value, setValue ] = useState("");
  const [ spanLabel, setSpanLabel ] = useState(value || defaultValue)
  const [ invalid, setInvalid ] = useState(false);
  function onClick(e: MouseEvent<HTMLButtonElement>, label: any, val: any) {
    if (onChange) {
      e.currentTarget.blur();
      setInvalid(false);
      onChange(val);
      setSpanLabel(label);
      // setValue(val);
    }
  };



  const VALUES = noneOption 
    ? [{label: noneOptionLabel, value: noneOptionValue}, ...values] 
    : values;

    const maybeOnClick = (label: unknown, val: unknown) => {
      if (onChange && !readOnly) {
        return {onClick: (e: MouseEvent<HTMLButtonElement>) => onClick(e, label, val)}
      } else return {}
    };

  return (
    <div className="base-input" style={{ pointerEvents: readOnly ? "none" : "auto" }}>
      {label && <label>{ label }</label> }
      <div 
        className={`picker${rounded ? " rounded-input" : ""}`}
        tabIndex={-1} 
        ref={reactRef}
        style={{ outline: invalid ? "solid 1px var(--eco-danger)" : "none" }}
      >
        {controlled && (value !== noneOptionValue) && 
        <label>
          <input 
            name={name} 
            value={value}
            data-testid={`dropdown-picker-input-${value}`}
            style={{ display: "none" }}
            onChange={() => null}
            required={required}
            onInvalid={e => {e.preventDefault(); setInvalid(true)}}
          />
          </label>
        }
        <button 
          className="dropdown-button" 
          type="button" 
          tabIndex={0}
        >
        <span>{ spanLabel }</span>
        <span className="material-symbols-rounded">expand_more</span> 
      </button>
      <div className="picker-content">
        <div className="section">
          {
            VALUES?.map(({ value, label }) =>  (
              <button   
                className="choice" 
                {...maybeOnClick(label, value)}
                name={name}
                data-testid={`dropdown-picker-button-${value}`}
                value={value}
                type={buttonType}
                key={value}
              >
                { label }
                <div className="bg"/>
              </button>
          ))
          }
        </div>
      </div>
    </div>
    </div>
  )
}