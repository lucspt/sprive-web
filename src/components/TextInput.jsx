
export default function TextInput({
   label, 
  value, 
  onChange, 
  containerStyle, 
  className="", 
  name,
  ...props
 }) {

  return (
    <div className={`${className}`} style={containerStyle}>
      { label && <label htmlFor={name}> {label} </label> }
      <input 
        type="text" 
        value={value} 
        onChange={e => onChange(e.target.value)} 
        name={name} 
        id={name}
        autoComplete="off"
        spellCheck="false"
        {...props}
      />
    </div>
  )
}