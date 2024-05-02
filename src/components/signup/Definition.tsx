import { DEFINITIONS } from "./constants";
import { DefinitionProps } from "./types";

/**
 * A measurement category definition. Explanation of a scope or GHG category. 
 * 
 * One of `category` or `scope` must be defined in order to render this component.
 * 
 * @param props
 * @param props.scope - The scope being defined
 * @param props.category - The category being defined
 * @param props.toggle - A function on click to toggle the category or scope as selected
 * @param props.isChecked - Whether or not the scope or category is currently checked
 * 
 * @returns A react component with the relevant GHG category or scope definition
 */
export default function Definition({ scope, category, toggle, isChecked }: DefinitionProps) {


  const definition = category ? DEFINITIONS[(category as keyof typeof DEFINITIONS)] : DEFINITIONS[scope as "1" | "2"]
  return category || scope && (
    <div className="dropdown-content">
    <p>
      <span className="definition">Sourced definition:</span> <br /> {definition}. <span>
        See <a className="link" 
        onClick={e => e.stopPropagation()} 
        href="https://www.epa.gov/climateleadership/scope-1-and-scope-2-inventory-guidance"
        rel="noreferrer noopener"
        target="_blank"
        >here</a> for more
      </span>
    </p>
    <div className="select">
      <button onClick={(e) => toggle(e, isChecked)} className="default-btn" type="button">
        {isChecked ? "Deselect" : "Select" }
        </button>
    </div>
  </div>
  )
}