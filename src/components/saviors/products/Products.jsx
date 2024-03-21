import { memo } from "react"
import { useLoaderData, useNavigate } from "react-router-dom"
import "./Products.css"
import NoData from "../../NoData"
import ProductWidget from "../../products/ProductWidget"

const Products = memo(function Products() {
  const products = useLoaderData();
  const nav = useNavigate();

  return products?.length > 0 ? (
    <div className="container products">
      <div className="actions">
        <button className="default-btn" onClick={() => nav('./create')}>create</button>
      </div>
    <div className="content" style={{ justifyContent: "center" }}>
      { products.map((p) => (
        <ProductWidget
          onClick={() => nav(`./${p._id}`)}
          key={Math.random()}
          name={p.name}
          co2e={p.co2e}
          image={p.image}
          rating={p.rating}
        />
        ))}
    </div>
    </div>
  ) : (
    <NoData 
      title="You haven't created any products yet"
      message="Would you like to?"
      onClick={() => nav("./create")}
      buttonText="create product"
  />
  )

})

export default Products;
