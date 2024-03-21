

export default function LargeWidget({ 
  animationClass, 
  children, 
  noDataMessage="no data available",
  noData,
  title, 
  titleStyle,
  style
 }) {

  return (
    <div className={`widget med ${animationClass}`} style={style}>
      <span style={titleStyle}>{ title }</span>
      { noData ?
        <div className="no-data" >
          <span>{ noDataMessage }</span>
        </div>
        : children
      }
    </div>
  )
}