import { redirect, useLoaderData, useNavigate } from "react-router-dom"
import { fetchData, formatCO2e, isObjectEmpty } from "../../utils"
import "./Ecosystem.css"
import { memo, useEffect, useState } from "react"
import PledgePopup from "./PledgePopup"
import { useEcosystemData } from "../../hooks/useEcosystemData"

export const loader = async ({ params }) => {
  let res = await fetch(
    `http://localhost:8000/saviors/${params.partnerId}?type=partners`
  )
  res = await res.json()
  if (res.ok) {
    return res.content 
  } else throw new Error("oops...something wen't wrong")
}

export const likePledge = async ({ request }) => {
  const url = new URL(request.url)
  const pledgeId = url.searchParams.get("resource")
  let res = await fetchData(`pledges/${pledgeId}/stars`, request.method)
  if (res.ok) {
    return redirect(".")
  } else throw new Error("oops... something wen't wrong")
}

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
        <div className="heading">
          <h2>{partner.name}</h2>
        </div>
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
              style={{ backgroundColor: showcase === "products" ? "var(--black)" : "transparent"}}
            >
              products
            </button>
            <button 
              onClick={() => setShowcase("pledges")}
              style={{ backgroundColor: showcase === "pledges" ? "var(--black)" : "transparent"}}
            >
              pledges
            </button>
          </div>
          <div className={`showcase ${showcase}`}>
            {
              showcase === "pledges"
              ? pledges.map(pledge => (
                <PledgeGridItem 
                  onClick={() => setPopup(pledge)}
                  key={pledge._id}
                  name={pledge.name}
                  className={pledge.name === popup.name ? " shown" : ""}
                  started={abbreviateDate(pledge.started)}
                  co2e={pledge.co2e}
                  />
                )
              )
              : products.length 
                ? products.map(product => (
                  <ProductGridItem 
                    name={product.activity}
                    co2e_avoided={product.co2e_avoided}
                    key={product._id}
                    product={product}
                    co2e={product.co2e}
                    onClick={() => nav(`../products/${product.product_id}`)}
                  />
                )
              )
              : <span className="no-products">this partner hasn't published any products yet</span>
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

const CO2eDigit = ({ co2e }) => {
  const [ digit, metric ] = formatCO2e(co2e)

  return (
    <span>
      <span className="digit">{digit}</span> {metric}
    </span>
  )
}

const PledgeGridItem = ({ 
  name, 
  co2e, 
  started, 
  onClick, 
  className 
}) => {
  return (
    <div 
      className={`item${className}`}
      tabIndex={0} 
      onClick={onClick}
    >
      <div className="heading">
        <span>{name}</span>
      </div>
      <div className="stat">
        <CO2eDigit co2e={co2e} />
      </div>
      <div className="info">
        <span>{started}</span>
      </div>
    </div>
  )
}

const ProductGridItem = ({ name, onClick, co2e, co2e_avoided, rating="B" }) => {
  return (
    <div className="item" tabIndex={0} onClick={onClick}>
      <div className="heading">
        <span>{name}</span>
        <span className={`rating ${rating}`}>{rating}</span>
      </div>
      <div className="infos">
      <div className="info">
        <span style={{ alignSelf: "flex-start" }}>CO2e:</span>
        <span>{formatCO2e(co2e).join(" ")}</span>
      </div>
      <div className="info" style={{ alignSelf: "flex-end" }}>
        <span>CO2e saved:</span>
        <span>{formatCO2e(co2e_avoided).join(" ")}</span>
      </div>
      </div>
    </div>
  )
}

export default PartnerCard