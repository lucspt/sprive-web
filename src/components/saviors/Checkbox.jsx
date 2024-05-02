
export default function Checkbox({ className, onChange, checked, props }) {

  return (
    <input 
      type="checkbox"
      className={`checkbox ${className}`}
      onChange={onChange}
      checked={checked}
      {...props}
    />
  )
}