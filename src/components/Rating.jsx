import "./Rating.css"

export default function Rating({ rating="", size=24, style, showText, children }) {

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
}