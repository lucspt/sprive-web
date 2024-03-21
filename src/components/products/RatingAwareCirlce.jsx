

export default function RatingAwareCirlce({ rating, enterAnim }) {

  
  return (
    <div className={`rating circle-bg ${enterAnim || ""}`}>
      { children }
    </div>
  )
}