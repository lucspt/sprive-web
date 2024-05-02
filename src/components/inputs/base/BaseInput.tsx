import { ComponentPropsWithRef, ForwardedRef, forwardRef } from "react"
import "./BaseInput.css";
import { BaseInputProps } from "./types";

/**
 * Renders a 'base' input. An input with common props and the app's theme. 
 * 
 * @param props 
 * @param props.name - The input's name
 * @param props.label - Will render a `<label>` containing this value 
 * @param props.className - Gives the container element a class name.
 * @param props.inputClass - Gives the input a class.
 * @param props.rounded - Whether to give the input a class of "rounded-input".
 * @param ref - A react ref to forward to the `<input>` element.
 * 
 * @returns {import("react").ForwardRefExoticComponent} - A forward ref component.
 */
export const BaseInput = forwardRef(function BaseInput({
  name, 
  label,
  className,
  inputClass, 
  rounded=true,
  ...props
}: BaseInputProps, ref: ForwardedRef<HTMLInputElement>) {

  const inputProps: ComponentPropsWithRef<"input"> = {
    autoCapitalize: "false",
    spellCheck: "false",
    autoComplete: "off",
    name,
    className: `${inputClass} ${rounded ? " rounded-input" : ""}`,
    ref,
    ...props,
  };

  return (
    <div className={`${className} base-input`}>
      {
        label   
          ? (
            <label>
              <span style={{ display: "block" }}>{ label }</span>
              <input {...inputProps} />
            </label>
          ) : (
            <input { ...inputProps } />
          )
      }
    </div>
  )
});