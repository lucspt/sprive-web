import Select from "react-select";


const style = {
  control: base => ({
    ...base,
    border: 0,
    color: "var(--black)",
    cursor: "text",
  }),
  container: base => ({
    ...base,
    color: "var(--black)",
    maxWidth: 250,
  }),
  option: base => ({
    ...base,
    color: "var(--black)"
  })
};

export default function SelectInput({ name, onChange, onChangeText, options, ...props }) {

  return (
    <Select 
    name={name}
    isClearable 
    isSearchable
    className="dropdown"
    options={options}
    theme={(theme) => ({
      ...theme,
      colors: {
        ...theme.colors, 
        primary: "var(--calm-blue)",
        danger: "var(--eco-danger)",
        
      }
      
    })}
    styles={style}
    onInputChange={onChangeText}
    onChange={onChange}
    {...props}
    />
  )
}