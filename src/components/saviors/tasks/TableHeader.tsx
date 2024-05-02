import { TableHeaderProps } from "./types";


export default function TableHeader({ text, expand, collapse, isExpanded, bg }: TableHeaderProps) {

  function onClick() {
    isExpanded ? collapse() : expand();
  };
  return (
    <div 
      className="header" 
      style={{ backgroundColor: bg }} 
      role="button"
      aria-label={isExpanded ? "collapse tasks table" : "expand tasks table"}
      onClick={onClick}
     >
      <span>{ text }</span>
      {isExpanded ?
          <span 
          className="material-symbols-rounded"
          >
          expand_less
        </span>
      : 
        <span 
        className="material-symbols-rounded"
        >
        expand_more
      </span>
      }
    </div>
  )
}