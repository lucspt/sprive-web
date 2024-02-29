import { memo, useEffect, useState } from "react"
import { fetchData, formatCO2e, isObjectEmpty } from "../../../../utils"
import { useNavigate } from "react-router-dom"
import DataTable, { ViewAsTable } from "../../../DataTable"

const Products = memo(function Products({ products: _products }) {
  const [ products, setProducts ] = useState([])
  const nav = useNavigate()
  const [ viewAsTable, setViewAsTable ] = useState(
    JSON.parse(localStorage.getItem("prefersTableView")) || false
  )

  useEffect(() => {
    if (isObjectEmpty(products)) {
      if (isObjectEmpty(_products)) {
        fetchData("saviors/products", "GET", {}, {}, setProducts)
      } else {
        setProducts(_products)
      }
    }
  }, [_products])


  useEffect(() => console.log(viewAsTable), [viewAsTable])

  return (
    <div className="content"
      style={{
        "display":  "flex", 
        "flexDirection": "column", 
        "alignItems": "center"
      }}>
        <ViewAsTable 
          viewAsTable={viewAsTable}
          setViewAsTable={setViewAsTable}
          navigation={() => nav("../products/create")}
        />
      {products && 
        viewAsTable ? 
      <div className="products table">
        <DataTable
          columns={["name", "category", "CO2e avoided", "CO2e per unit", "rating"]}
          className="products"
          >
          {
            products.map(product => (
              <ProductRow product={product} nav={nav} key={product._id}/>
              ))
            }
            </DataTable>
            </div>
        :
        <div className="products widget-showcase">
          {products.map(product => <ProductWidget product={product} key={product._id} nav={nav}/>)}
        </div>
      }
    </div>
    )
  })

const ProductWidget = ({ nav, product: p }) => {

  const { rating } = p
  const link = `../products/${p.product_id}`
  const edit = () => nav(`${link}/edit`)
  const open = () => nav(link)
  return (
    <div className="product showcase-widget" 
    tabIndex={1} 
    onClick={open}
    onKeyDown={e => e.key === "Enter" && open()}
    >
      <div className="title description">
        <span style={{fontSize: "1.12em"}} className="label">{p._id.replaceAll("%20", " ")}</span>
        <span className={`rating ${rating || "B"}`}>{rating || "B"}</span>
        <div className="options">
          <button onClick={e  => {e.stopPropagation(); edit()}} style={{pointerEvents: "all"}}>
            <span className="material-symbols-rounded pink-hov">edit</span>
          </button>
          <button>
          <span className="material-symbols-rounded pink-hov">open_in_full</span>
          </button>
      </div>
      </div>
      <div className="product-info description">
        <div className="info-columns">
          <span>CO2e avoided:</span>
          <span>{formatCO2e(p.co2e_avoided).join(" ")}</span>
        </div>
        <div className="info-columns">
          <span>total CO2e:</span>
          <span>{formatCO2e(p.co2e).join(" ")}</span>
        </div>
        <div className="reflection"></div>
      </div>
    </div>
  )
}

const ProductRow = ({ nav, product: p }) => {

  const { rating, _id: name, product_id } = p
  const link = `../products/${product_id}`
  const edit = () => nav(`${link}/edit`)
  const open = () => nav(link)
  return (
    <div className="row"
      onClick={open}>
    <span>{name}</span>
      <span>{p.category || "category here?"}</span>
      <span>{p.co2e_avoided}</span>
      <span>{formatCO2e(p.co2e)}</span>
      <span className={`align-end rating ${rating || "B"}`}>{rating || "B"}</span>
      <div className="align-end">
        {/* <button onClick={e => {e.stopPropagation(); edit()}}>
          <span className="material-symbols-rounded align-end pink-hov" style={{marginRight: 5}}>edit</span>
        </button> */}
        <button>
          <span className="material-symbols-rounded align-end pink-hov">
            equalizer
          </span>
        </button>
      </div>
    </div>
)
}

export default Products
