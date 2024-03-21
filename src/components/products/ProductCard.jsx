import { useLoaderData, useNavigate } from "react-router-dom";
import { fetchData, formatCO2e } from "../../utils";
import Header from "../Header";
import "./ProductCard.css"
import StageDropdown from "./StageDropdown";
import PartnerProductOptions from "../saviors/products/PartnerProductOptions"
import { useState } from "react";
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

const STAGESORDER = [
  "sourcing",
  "processing",
  "assembly",
  "transport",
];


export const _REQUIRED_STAGES = [
  "sourcing",
  "processing",
  "assembly",
  "transport",
];

export const addMissingProductStages = (productStages) => {
  const stagesPresent = Array.from(productStages, stage => stage.stage);
  return [
    ...productStages,
    ..._REQUIRED_STAGES.filter(
      x => !stagesPresent.includes(x)
      ).map(missingStage => ({ stage: missingStage, co2e: 0, processes: [] }))
    ];
};

const ProductCard = ({ optionsFooter, setEditingProcess }) => {
  const product = useLoaderData();
  const sortedStages = addMissingProductStages(product?.stages)?.sort(
    (a, b) => STAGESORDER.indexOf(a.stage) - STAGESORDER.indexOf(b.stage)
  );
  const { co2e: productCO2e, product_id } = product;
  const [ productName, setProductName ] = useState(product.name);

  return productCO2e && (
    <div className={`ecosystem-card ecosystem-product product-card${optionsFooter ? " has-footer" : ""}`}>
      <div className="full-space" style={{ overflow: "scroll" }}>
      <Header 
        text={productName}
        className="heading" 
        fontSize="large"
      />
      <div className="content" >
        <img src="https://static.ewg.org/skindeep_images/8236/823601.jpg" className="product-image"/>
        <div className="body">
          <div className="traceback">
            <span className="bold">Traceback</span>
            <span className="bold">{formatCO2e(productCO2e).join(" ")} </span>
          </div>
          <div className="stages">
            {sortedStages.map(stage => {
              const { co2e, stage: stageName } = stage;
              return (
                <StageDropdown
                  percentage={Math.round((co2e / productCO2e) * 100)}
                  co2e={co2e} 
                  key={stageName}
                  name={stageName}
                  productId={product_id}
                  productRating={product.rating}
                  processes={stage.processes}
                  setEditingProcess={setEditingProcess}
                />
              )
            })}
          </div>
        </div>
      </div>
      </div>
      { optionsFooter &&
       <PartnerProductOptions product={product} setName={setProductName}/> 
      }
    </div>
  )
}

export default ProductCard

