import { useLoaderData, useNavigate } from "react-router-dom";
import { formatCO2e, isObjectEmpty } from "../../utils/utils";
import { Header } from "../header/Header";
import "./ProductCard.css"
import StageDropdown from "./StageDropdown";
import PartnerProductOptions from "../saviors/products/PartnerProductOptions"
import { useEffect, useState } from "react";
import { _REQUIRED_STAGES } from "./constants";
import { ProductCardProps } from "./types";
import { Product, ProductProcess } from "../saviors/products/types";
import { addMissingProductStages } from "../saviors/products/editor/utils";

export const ProductCard = ({ optionsFooter, setEditingProcess, stageToExpand }: ProductCardProps) => {
  const product = useLoaderData() as Product;
  const nav = useNavigate();
  useEffect(() => {
    if (isObjectEmpty(product)) {
      nav(-1);
    };

  }, [product]);

  const sortedStages = addMissingProductStages(product?.stages)?.sort(
    (a, b) => _REQUIRED_STAGES.indexOf(a.stage) - _REQUIRED_STAGES.indexOf(b.stage)
  );

  const { co2e: productCO2e, product_id } = product;
  const [ productName, setProductName ] = useState(product.name);

  return productCO2e && (
    <div className={`ecosystem-card ecosystem-product product-card${optionsFooter ? " has-footer" : ""}`}>
      <div className="full-space" style={{ overflow: "scroll" }}>
      <Header 
        text={productName}
        className="heading" 
        fontSize="lg"
      />
      <div className="content" >
        <img src="https://static.ewg.org/skindeep_images/8236/823601.jpg" className="product-image"/>
        <div className="body">
          <div className="traceback">
            <span className="bold">Traceback</span>
            <span className="bold">{formatCO2e(productCO2e, { stringify: true })} </span>
          </div>
          <div className="stages">
            {sortedStages.map((stage, index) => {
              const { co2e, stage: stageName } = stage;
              return (
                <StageDropdown
                  percentage={Math.round((co2e / productCO2e) * 100)}
                  co2e={co2e} 
                  key={stageName}
                  name={stageName}
                  productId={product_id}
                  shouldExpand={stageToExpand === index}
                  productRating={product.rating as string}
                  processes={stage.processes}
                  setEditingProcess={(p: Partial<ProductProcess>) => {
                    setEditingProcess && setEditingProcess({...p, stageIndex: index})
                  }}
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
