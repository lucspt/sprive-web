import { MouseEvent, useState } from "react";
import "./GHGCategoryDropdown.css";
import Definition from "./Definition";
import { GHGCategoryDropdownProps } from "./types";

export default function GHGCategoryDropdown({ 
  category, 
  name, 
  isChecked,
  toggle
 }: GHGCategoryDropdownProps) {

  const [ expanded, setExpanded ] = useState(false);
  function onClick(e: MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
    setExpanded(prev => !prev);
  };

  return (
    <div 
    className="category-dropdown"
    role="button"
    tabIndex={0}
    onClick={onClick}
    >
      <div className="title">
        <span>Category {category}: {name}</span>
        <div>
          <button type="button" onClick={(e) => toggle(e, isChecked)} className="select">
          <span className="material-symbols-rounded">
            { isChecked ? "radio_button_checked" : "radio_button_unchecked"}
          </span>
        </button>
        <span 
          className="material-symbols-rounded"
          style={{ transform: expanded ? "rotate(-90deg)" : "unset"}}
          >
          chevron_right
        </span>
        </div>
      </div>
      {
        expanded && (
          <Definition category={name} isChecked={isChecked} toggle={toggle}/>
        )
      }
    </div>
)};