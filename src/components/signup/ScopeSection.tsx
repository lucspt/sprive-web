import { useState } from "react";
import "./ScopeSection.css"
import Definition from "./Definition";
import { ScopeSectionProps } from "./types";

/**
 * A component to select a scope as a measurement category 
 * If scope 3 onClick renders further dropdowns to select scope 3 categories
 * 
 * @param props
 * @param props.scope - The scope this section is for
 * @param props.children - Children to render
 * @param props.toggle - Toggle selection function
 * @param props.isChecked - Whether or not the scope is checked, irrelevant if scope is "3"
 * 
 * @returns 
 */
export function ScopeSection({ 
  scope, 
  children, 
  toggle,
  isChecked,
 }: ScopeSectionProps) {
  const [ expanded, setExpanded ] = useState(false)

  return (
    <div
      className="scope-section"
      role="button"
      onClick={() => setExpanded(prev => !prev)}
    >
      <div className="title">
        <span>Scope { scope }</span>
        <div>
          {scope !== "3" && toggle && 
            <button onClick={(e) => toggle(e, isChecked)} type="button" className="select">
              <span className="material-symbols-rounded">
                { isChecked ? "radio_button_checked" : "radio_button_unchecked" }
              </span>
            </button>
          }
          <span 
            className="material-symbols-rounded"
            style={{ transform: expanded ? "rotate(-90deg)" : "unset"}}
          >
            chevron_right
          </span>
        </div>
      </div>
      <div className="dropdown">
        { 
        expanded && 
          <>
            {scope === "3" 
              ? children
              : <Definition scope={scope} isChecked={isChecked as boolean} toggle={toggle as Function}/>
            }
          </>
        }
      </div>
    </div>
  )
}