import Rating from "../Rating";
import { formatCO2e } from "../../utils";
import "./ProductWidget.css";


export default function ProductWidget({ name, image, rating, co2e, onClick }) {

  return (
    <button className="product-widget" onClick={onClick}>
      <div className="image">
        <img src="https://static.ewg.org/skindeep_images/8236/823601.jpg" />
        <span className="title">{ name }</span>
      </div>
      <div className="details">
        <div className="emissions">
          <Rating rating={rating || "good"} showText={false} size={16} />
          <span className="co2e">{formatCO2e(co2e).join(" ")}</span>
        </div>
      </div>
      <div className="bg" />
    </button>
  )
}