import "./Rating.css"
import { RatingProps } from "./types"

export default function Rating({ rating="", size=24, style, showText, children }: RatingProps) {

  return (
    <div className="rating" style={style}>
      <div className={`rating-dot ${rating}`}
        style={{ width: size, height: size, borderRadius: "50%"}}
      >
        { children }
      </div>
      {showText && <span>{ rating }</span>}
    </div>
  )
};