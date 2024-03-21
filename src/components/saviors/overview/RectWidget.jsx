import { formatCO2e } from "../../../utils";

export default function RectWidget({ 
  animationClass, 
  getAnimationDelay, 
  title, 
  digit,
  titleStyle,
  isCO2eDigit,
  style,
  children,
  digitContainerStyle
 }) {
  let _digit, _metric;
  if (isCO2eDigit) {
    ([ _digit, _metric ] = formatCO2e(digit));
  }
  const delay = getAnimationDelay ?getAnimationDelay() : 0;
  return (
    <div 
    className={`info-widget widget ${animationClass}`}
    style={{animationDelay: `${delay}s`, ...style}}
  >
    {
      isCO2eDigit ? 
      <>
      <span className="info-title" style={titleStyle}>{ title }</span>
      <div>
        <span className="info-digit">{_digit}</span>
        <span className="info-metric">{_metric}/CO2e</span>
      </div>
      </>
    :
    <div style={digitContainerStyle}>
      <span className="info-title">{ title }</span>
      <span className="info-digit">{digit}</span>
    </div>
    }
    { children }
  </div>
  )
}