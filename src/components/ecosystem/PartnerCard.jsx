import { redirect, useLoaderData, useNavigate } from "react-router-dom"
import { fetchWithAuth, formatCO2e, isObjectEmpty } from "../../utils/utils"
import "./Ecosystem.css"
import { Header } from "../header/Header";
import { memo, useEffect, useState } from "react"
import PledgeGridItem from "./PledgeGridItem";
import PledgePopup from "../pledges/PledgePopup"
import { ProductWidget } from "../products/ProductWidget";

export const loader = async ({ params }) => {
  let res = await fetch(
    `http://localhost:8000/partners/${params.partnerId}`
  )
  if (res.ok) {
    res = await res.json()
    return res.content 
  } else throw new Error("oops...something wen't wrong")
}

export const likePledge = async ({ request }) => {
  const url = new URL(request.url)
  const pledgeId = url.searchParams.get("resource")
  await fetchWithAuth(`pledges/${pledgeId}/stars`, {method: request.method});
  return null;
};

const PartnerCard = memo(() => {
  const [ popup, setPopup ] = useState({})
  const nav = useNavigate();
  const partner = useLoaderData();
  const [ showcase, setShowcase ] = useState(partner.products.length ? "products" : "pledges")

  const abbreviateDate = date => {
    return new Date(date).toLocaleDateString(
      undefined, {month: "2-digit", year: "2-digit", day: "2-digit"}
    )
  }

  const { pledges, products } = partner
  const liked = null

  useEffect(() => {
    if (!isObjectEmpty(popup)) {
      setPopup(partner.pledges.find(x => x._id === popup._id))
    }
  }, [partner])

  return pledges && (
    <>
      <div className="savior-card">
        <Header text={partner.name}/>
        <div className="stats-row">
            <div className="stat one" 
            // style={{ animationDelay: "0.45s"}}
            >
              <span>pledges made</span>
              <span className="digit">{pledges.length}</span>
            </div>
            <div className="stat two"
            //  style={{ animationDelay: "2.7s"}}
            >
              <span>emissions saved</span>
              <Stat co2e={partner.emissions_saved} />
            </div>
            <div className="stat three" 
            // style={{ animationDelay: "1.6s"}}
            >
              <span>products</span>
              <span className="digit">{products.length}</span>
            </div>
          </div>
        <div className="showcase-content" 
        // style={{ animationDelay: "4s" }}
        >
          <div className="switch">
            <button 
              onClick={() => setShowcase("products")}
              style={{ backgroundColor: showcase === "products" ? "var(--black)" : "var(--highlight)"}}
            >
              products
            </button>
            <button 
              onClick={() => setShowcase("pledges")}
              style={{ backgroundColor: showcase === "pledges" ? "var(--black)" : "var(--highlight)"}}
            >
              pledges
            </button>
          </div>
          <div className={`showcase ${showcase}`}>
            {
              showcase === "pledges" ?
               pledges?.length > 0 ?
               (pledges.map(pledge => (
                   <PledgeGridItem 
                   onClick={() => setPopup(pledge)}
                   key={pledge._id}
                   name={pledge.name}
                   className={pledge.name === popup.name ? " shown" : ""}
                   started={abbreviateDate(pledge.started)}
                   co2e={pledge.co2e}
                   />
              ))) 
              : (
                <span className="empty">this partner hasn't made any pledges yet</span>
              )
              : products.length > 0
                ? products.map(product => (
                  <ProductWidget
                    name={product.name}
                    key={product._id}
                    image={product.image}
                    co2e={product.co2e}
                    onClick={() => nav(`../products/${product.product_id}`)}
                  />
              ))
              : <span className="empty">this partner hasn't published any products yet</span>
            }
          </div>
        </div>
        <div 
          className={`popup-cover${ popup.name ? " show" : ""}`}
        >
          <div 
            style={{position: "absolute", inset: 0}}
            onClick={() => setPopup({})}
          ></div>
          <div
            className={`popup${ popup.name ? " show" : ""}`}
            >
            {
              showcase === "pledges" && 
              <PledgePopup 
                pledge={popup} 
                exit={() => setPopup({})} 
              />
            }
          </div>
        </div>
      </div>
    </>
  )
})


const Stat = ({ co2e }) => {
  const [ digit, metric ] = formatCO2e(co2e)

  return (
    <span style={{ display: "flex", gap: 10, height: "100%" }}>
      <span className="digit">{digit}</span>
      <span className="metric">
        <span>{metric}</span>
        <span>CO2e</span>
      </span>
    </span>
  )
}

export default PartnerCard