

export default function Header({ 
  fontSize="xlarge", 
  className="", 
  children=null, 
  text,
  style,
  hprops,
  ...props
}) {

  return (
    <header className={`${className} header`} style={style} {...props}>
      <h1 style={{ fontSize: `var(--fontsize-${fontSize})` }}>{ text }</h1>
      { children }
    </header>
  )
}