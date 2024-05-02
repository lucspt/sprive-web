import { SeeMoreProps } from "./types";

export default function SeeMore({ isExpanded, expand, collapse }: SeeMoreProps) {

  return (
    <div className="expand" style={{ backgroundColor: isExpanded ? "unset": "var(--darker)"}}>
    {
      isExpanded ?
      (
        <button onClick={collapse}>
          <span>show less</span>
          <span style={{ transform: "rotate(-90deg)"}} className="material-symbols-rounded">arrow_right</span>
        </button>
        )
      : (
        <button onClick={expand}>
          <span>show more</span>
          <span className="material-symbols-rounded">arrow_right</span>
        </button>
      )
    }
  </div>
  )
}