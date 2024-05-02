import { memo } from "react"
import { useLoaderData, useNavigate } from "react-router-dom"
import "./Products.css"
import { NoData } from "../../common/NoData"
import { ProductWidget } from "../../products/ProductWidget"
import { Header } from "../../header/Header";
import { Product } from "./types"

export const Products = memo(function Products() {
  const products = useLoaderData() as Product[];
  const nav = useNavigate();

  const { length } = (products || []);
  return (
    <div className="container products page">
      <Header text="Products">
        {length > 0 && <button className="default-btn create" onClick={() => nav('./create')}>create</button>}
      </Header>
      {length > 0 ? (
        <div className="content" style={{ justifyContent: "center" }}>
          { products.map((p) => (
            <ProductWidget
              onClick={() => nav(`./${p._id}`)}
              key={Math.random()}
              name={p.name}
              co2e={p.co2e}
              // image={p.image}
              // rating={p.rating}
            />
            ))}
        </div>
      ) : (
          <NoData 
            title="You haven't created any products yet"
            subtitle="Would you like to?"
            linkTo="./create"     
            linkText="Create product"
          />
        )
      }
    </div>
  ) 

});
