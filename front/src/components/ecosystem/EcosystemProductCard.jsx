import { useLoaderData } from "react-router-dom";
import Star from "./Star";
import { fetchData, formatCO2e, isObjectEmpty } from "../../utils";
import { useEffect } from "react";


export const loadProduct = async ({ params }) => {
  let res = await fetch(`http://localhost:8000/products/${params.productId}`)
  res = await res.json()
  return res.content
}

export const productActions = async ({ params, request }) => {
  const response = await fetchData(
    `products/${params.productId}/stars`, request.method
  )
  return response.content
}

const CO2eDigit = ({ co2e }) => {
  const [ digit, metric ] = formatCO2e(co2e)

  return (
    <span className="info">
      <span className="digit">{digit}</span> {metric}
    </span>
  )
}

const EcoSystemProductCard = () => {
  const product = useLoaderData();


  useEffect(() => {console.log(product)}, [product])

  const labelUnitType = unitType => unitType === "count" ? "unit" : unitType

  return product.co2e && (
    <div className="ecosystem-card">
      <div className="heading">{product.name}</div>
      <div className="content" >
        <div className="stats-row" >
          <div className="stat">
            <span className="title">CO2e per {labelUnitType(product.unit_types[0])}</span>
            <div className="info">
              <CO2eDigit co2e={product.co2e} />
            </div>
          </div>
          <div className="stat">
            <span className="title">CO2e saved</span>
            <CO2eDigit co2e={product.co2e_avoided} />
          </div>
        </div>
        <div className="product-body">
          <div className="field">
            <span>description:</span>
            <p>{product.keywords}</p>
          </div>
        </div>
      </div>
      <div className="star-footer" style={{ justifyContent: "space-between"}}>
        <div className="rating">
          <span 
            className={`rating ${product.rating || "B"}`}
            style={{ fontSize: "var(--fontsize-large)"}}
          >
            {product.rating || "B"}
          </span>
          <span>sprive rating</span>
        </div>
        <div className="right">
          <Star 
            stars={product.stars} 
            resourceId={product.product_id}>
          </Star>
        </div>
      </div>
    </div>
  )
}

export default EcoSystemProductCard

