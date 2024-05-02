import { formatCO2e } from "../../utils/utils";
import "./ProductWidget.css";
import { ProductWidgetProps } from "./types";


export function ProductWidget({ name, co2e, onClick }: ProductWidgetProps) {

  return (
    <button className="product-widget" onClick={onClick}>
      <div className="image">
        <img src="https://static.ewg.org/skindeep_images/8236/823601.jpg" />
        <span className="title">{ name }</span>
      </div>
      {/* <Rating rating={rating || "good"} showText={false} size={16} /> */}
      <span className="co2e">{formatCO2e(co2e, { stringify: true })}</span>
      <div className="bg" />
    </button>
  )
}