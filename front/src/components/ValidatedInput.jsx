import { useCallback } from "react";


export default function ValidatedInput({ 
  name, 
  label,
  message, 
  placeholder=null, 
  defaultValue=null, 
  type="text",
  style={},
  onChange=null,
  children=null,
  readOnly=false,
  inputClass="",
  list="",
}) {

  const onInvalid = useCallback(e => {
    e.preventDefault(); 
    e.target.classList.add("invalid")
  }, [])

  const _onChange = useCallback(e => {
    e.target.value && e.target.classList.remove("invalid")
    onChange && onChange(e);
  }, [])

  return (
    <div className="input-field invalid-rel" style={style}>
      {label && <label htmlFor={name}>{label}</label>}
        <input
          onInvalid={e => onInvalid(e)}
          onChange={e => _onChange(e)}
          type={type}
          autoComplete="off"
          name={name}
          defaultValue={defaultValue}
          placeholder={placeholder}
          id={name} 
          required
          list={list}
          readOnly={readOnly}
          className={inputClass}
        />
      <span>{message}</span>
      {children && children}
    </div>
  )
}



export const  ControlledValidatedInput = ({ 
  name, 
  label,
  message, 
  placeholder=null, 
  value="",
  type="text",
  style={},
  onChange=null,
  children=null,
  readOnly=false,
  inputClass="",
  list="",
}) => {

  const onInvalid = useCallback(e => {
    e.preventDefault(); 
    e.target.classList.add("invalid")
  }, [])

  const _onChange = useCallback(e => {
    e.target.value && e.target.classList.remove("invalid")
    onChange && onChange(e);
  }, [])

  return (
    <div className="input-field invalid-rel" style={style}>
      {label && <label htmlFor={name}>{label}</label>}
        <input
          onInvalid={e => onInvalid(e)}
          onChange={e => _onChange(e)}
          type={type}
          autoComplete="off"
          name={name}
          value={value}
          placeholder={placeholder}
          id={name} 
          required
          list={list}
          readOnly={readOnly}
          className={inputClass}
        />
      <span>{message}</span>
      {children && children}
    </div>
  )
}