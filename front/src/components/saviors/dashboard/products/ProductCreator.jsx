import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import ValidatedInput from "../../../ValidatedInput"
import { fetchData } from "../../../../utils"

const ProductCreator = function ProductCreator() {

  const nav = useNavigate()
  const [ name, setName ] = useState("")


  const update = e => {
    e.preventDefault()
    setName(e.target.elements["name"].value)
  }

  const onSubmit = async e => {
    e.preventDefault()
    const kwds = e.target.elements["keywords"].value
    const _name = name.trim() // whitespace causes confusion with flask 
    const productId = await fetchData("saviors/products", "PUT")
    nav(`../${productId.content}/edit`, {state: {keywords: kwds, name: _name }, replace: true})
  }

  return (
    <div className="product-creator">
      {!name ?
        <form 
            className="field" 
            style={{ gap: name ? 20 : 30}}
            key="name" 
            action="" 
            onSubmit={e => update(e)}
            >
            <ValidatedInput 
              label="name of product"
              message="please choose a name"
              name="name"
            />
            <button className="default-btn" type="submit">
              next
            </button>
          </form>
          :
          <form 
            className="field" 
            action="" 
            key="keywords" onSubmit={e => onSubmit(e)}>
            <label htmlFor="keywords">description</label>
            <textarea 
              name="keywords"
              id="keywords"
              rows={6}
            />
            <button 
              type="submit" 
              className="default-btn"
            >
              next
            </button>
            </form> 
        }
    </div>
  )
}

export default ProductCreator