import { useLoaderData, useNavigate } from "react-router-dom"
import Visualization from "../../../Visualization"
import { useEffect, useState, memo } from "react"
import { isObjectEmpty, fetchData, formatCO2e } from "../../../../utils"
import ValidatedInput from "../../../ValidatedInput"
import DropdownInput from "../.../../../../DropdownInput"
import "./ProductCard.css"


const aggregationRequests = (id) => {
  return {
    "pieChart": {
    "filters": [
      {"$match": {"product_id": id}},
      {
        "$group": {
            "_id": "$stage",
            "co2e": {"$sum": "$co2e"},
            },
          },
        {"$sort": {"co2e": -1}},
        {"$limit": 5},
     {
         "$group": {
          "_id": null,   
          "labels": {"$push": "$_id"},
          "data": {"$push": "$co2e"}
         }
     }
    ],
    "collection": "products",
    "query_type": "aggregate"
  }
}
}

export const publishProduct = async ({ request }) => {
  let formData = await request.formData();
  formData = Object.fromEntries(formData);
  console.log(formData, "FORMDATAAAA");
  return null;
  // fetchData("saviors/factors", "POST", formData)
}



const Widget = ({ 
  title, 
  infoDigit, 
  infoMetric,
  digitStyle={}, 
  style={}, 
}) => {

  let digit, metric;
  if (infoMetric) {
    digit = infoDigit;
    metric = infoMetric;
  } else {
    ([ digit, metric ] = formatCO2e(infoDigit));
  }

  return (
    <div className={`info-widget widget square`} style={style}>
      <span>{title}</span>
      <div className="widget-info" style={digitStyle}>
        <span className="info-digit">{digit}</span>  
        <span className="info-metric">{metric}</span>
      </div>
    </div>
  )
}

export const ProductCard = memo(function ProductCard() {

  const innerTextPlugin = text => ({
    id: "innerText",
    afterDatasetDraw(chart, args, options) {
      const { ctx } = chart;
      const { meta } = args
      const xCoor = meta.data[0].x
      const yCoor = meta.data[0].y
      ctx.save()
      ctx.textAlign = "center"
      ctx.font = "1.5em monospace"
      ctx.fillStyle = "#fff"
      ctx.fillText(text, xCoor, yCoor)
      ctx.restore()
    }
  })
  const productId = useLoaderData()
  const [ productData, setProductData ] = useState({})
  const nav = useNavigate()
  const [ publishing, setPublishing ] = useState({ 
    popup: false, 
    invalid: "",
    disabled: false
  })
  const [ possibleUnitTypes, setPossibleUnitTypes ] = useState([])
  const [ mustUnpublishFirst, setMustUnpublishFirst] = useState(false)
    
    useEffect(() => {
      const getProductData = () => {
        const { pieChart } = aggregationRequests(productId)
        if (isObjectEmpty(productData)) {
          Promise.all([
            fetchData(`saviors/products/${productId}`, "GET"),
            fetchData("saviors/data",  "POST",  pieChart)
          ]).then(res => {
            const [ product, pieChart ] = res 
            const { content: _product } = product
            setProductData({
              "product": _product,
              "pieChart": res[1].content[0]
            })
            setPublishing(prev => {
              return {
                ...prev, 
                "initialName": _product.name, 
                "initialKeywords": _product.keywords
              }
            })
          })
      }
    }
    getProductData()
    }, [productId])
  
    useEffect(() => console.log(productData, "pdata"), [productData])

    useEffect(() => {
      if (publishing.popup && !possibleUnitTypes.length) {
        const getPossibleUnitTypes = async () => {
          let res = await fetch(
            "http://localhost:8000/factors/unit_types/possibilities"
          );
          res = await res.json();
          console.log("RES", res)
          setPossibleUnitTypes(res.content);
        }
        getPossibleUnitTypes();
      }
    }, [publishing.popup])


    const publish = e => {
      e.preventDefault()
      let formData = new FormData(e.target)
      formData = Object.fromEntries(formData.entries())
      let { activity, keywords } = formData
      keywords = keywords.trim()
      if (keywords.length < 20) {
        setPublishing(prev => {return {...prev, invalid: "invalid"}})
        return
      }
      console.log(formData, "FORMDATAAAA")
      const { product: { co2e, product_id, co2e_avoided } } = productData 
      activity = activity.trim()
      Object.assign(
        formData, {
          name: activity, 
          product_id: product_id, 
          co2e: co2e,
          co2e_avoided: co2e_avoided
        }
        )
      fetchData("saviors/products/publishings", "POST", formData)
      .then(() => {
          setProductData(prev => {
            return {
              ...prev,
              product: {...prev.product, ...formData, published: true}
            }
          })
          setPublishing(prev => {return {...prev, "popup": false}})
      })
    }
  
    const { product: _product, pieChart } = productData

    const unpublish = () => {
      const { product: { product_id } } = productData
          fetchData(`saviors/products/publishings/${product_id}`, "DELETE")
          .then(() => {
          setProductData(prev => {
            return {
              ...prev,
               product: {...prev.product, published: false}
            }
          })
          setPublishing(prev => {return {...prev, "popup": false}})
        })
      
    }
    return _product && (
      <div className="product-card">
        {
          mustUnpublishFirst && 
          <span className="unpublish-first"
            onAnimationEnd={() => setMustUnpublishFirst(false)}
          >
            You must temporarily unpublish this product before editing
          </span>
        }
        <div className="heading" style={{ width: "100%" }}>
          <header>
            <h1 style={{fontSize: "2em", minHeight: 32}}>{_product.name}</h1>
          </header>
        </div>
          <div className="info">
            <div className="summary">
              <Widget 
                  className="product-stars"
                  infoDigit={_product.stars || 0}
                  title="stars"
                  digitStyle={{gap: 0, justifyContent: "flex-end"}}
                  infoMetric=" "
                  style={{justifyContent: "unset", display: _product.published ? "grid" : "none"}}
                />
              <Widget
                  infoDigit={_product.stages.length}
                  title="unique stages"
                  style={{display: _product.published ? "none" : "grid"}}
                  infoMetric=" "
                />
              <Widget 
                title="CO2e emissions"
                infoDigit={Math.round(_product.co2e)}
                />
              <Widget 
                title="CO2e avoided:"
                infoDigit={Math.round(_product.co2e_avoided)}
                />
              </div>
            </div>
            <div className="body">
              {/* <div className="description">{_product.keywords}</div> */}
              <div className="charts" style={{ justifyContent: "center" }}>
                  {
                    pieChart?.labels &&
                    <Visualization 
                    title="emissions distribution"
                    id={productId}
                    type="doughnut"
                    backgroundColor="#181b1f"
                    labels={pieChart.labels}
                  plugins={[innerTextPlugin(_product.rating || "B")]}
                    style={{width: "fit-content", height: 250}}
                    datasets={[{data: pieChart.data, label: "emissions"}]}
                    options = {{
                      plugins: {
                        legend: {
                          position: "bottom",
                          align: "center",
                          display: true,
                          padding: {left: 20}
                        }
                      }
                    }}
                    />  
                  }
              </div>
                <div className="buttons" style={{ 
                  display: "flex", 
                  justifyContent: 
                  "flex-end", gap: 40}}>
                {
                  _product.published?
                  <button className="white-btn"
                  onClick={e => {e.target.blur(); setMustUnpublishFirst(true)}}
                  >
                  edit
                </button>
                :
                <button className="white-btn"
                  onClick={() => nav("edit")}
                  >
                  edit
                </button>
                }
                  <button className="white-btn"
                    style={{ width: 90 }}
                    onClick={() => setPublishing(prev => {return {...prev, popup: true}})}
                    >
                      {_product.published ? "unpublish" : "publish"}
                    </button>
              </div>
          </div>
        {publishing?.popup && (
          <>
          <div 
            className="publish-cover" 
            onClick={() => setPublishing(prev => {return {...prev, popup: false}})}
          ></div>
          {_product.published ? 
          <div className="unpublish-popup">
            <div className="top">
              <button 
                className="pink-hov"
                style={{ display: "flex", alignItems: "center" }}
                onClick={() => setPublishing(prev => {return {...prev, popup: false}})}
              >
                <span className="material-symbols-rounded">arrow_back</span>
              </button>
            <span>Are you sure you want to unpublish this product?</span>
            </div>
            <button className="default-btn yes"
              onClick={unpublish}
            >yes</button>
          </div>
          :
            <div className={`publish-form ${publishing.invalid}`}>
              <form onSubmit={e => publish(e)}>
                <button 
                  className="back" 
                  type="button"
                  onClick={() => setPublishing(prev => {return {...prev, popup: false}})}
                  style={{ alignSelf: "flex-start", cursor: "pointer" }}
                >
                  <span className="material-symbols-rounded">arrow_back</span>
                </button>
                <ValidatedInput 
                  name="activity"
                  type="text"
                  message="you must provide a name!"
                  placeholder="product name"
                  defaultValue={_product.name}
                  label="name"
                  // onChange={e => setProductData(prev => {
                  //   return {...prev, product: {...prev.product, name: e.target.value}}
                  // })}
                  style={{
                    flexDirection: "column", 
                    width: "80%",
                    maxWidth: "unset"
                }}
                  />
                  <div className="input-field" style={{ maxWidth: "80%", position: "relative" }}>
                  <label htmlFor="description">description</label>
                  <textarea 
                    rows={4}
                    style={{ width: "100%" }}
                    className={publishing.invalid}
                    id="description"
                    defaultValue={_product.keywords}
                    onChange={e => e.target.value.length > 20 && 
                      setPublishing(prev => { 
                      return {...prev, invalid: ""}
                    })}
                    name="keywords"
                    required
                    placeholder="product description"
                    />
                    <span className="after">please provide a longer description!</span>
                </div>
                <DropdownInput
                  label="unit type"
                  id="unit_types"
                  name="unit_types"
                  onInvalid={() => setPublishing(prev => {return {...prev, disabled: true}})}
                  values={possibleUnitTypes}
                  initialValue={_product.unit_types}
                  className="input-field"
                  inputClass="transparent-input"
                  onValid={() => setPublishing(prev => {return {...prev, disabled: false}})}
                />
                <button 
                  type="submit" 
                  disabled={publishing.disabled}
                  className="default-btn submit"
                >
                  submit
                </button>
              </form>
          </div>
          }
          </>
        )
        }
      </div>
    )
  })
  