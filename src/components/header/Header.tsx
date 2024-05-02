import { HeaderProps } from "./types";
import "./Header.css";

/**
 * 
 * @param props
 * @param props.fontSize - Is passed to `<Header/>` as the `fontSize` prop
 * @param props.className - A classname to add to the `<header/>` element
 * @param props.text - The text to render.
 * @param props.style - Styles to give the `<header/>` element
 */
export const Header = ({ 
  fontSize="xl", 
  className="", 
  children=null, 
  text,
  style,
  ...props
}: HeaderProps) => {

  return (
    <header className={`${className} header`} style={style} {...props}>
      <p style={{ fontSize: `var(--fontsize-${fontSize})`, ...style }}>{ text }</p>
      { children }
    </header>
  )
}