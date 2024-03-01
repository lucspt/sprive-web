import { useEffect, useState } from "react"
import { useLoaderData, useNavigate } from "react-router-dom"
import ValidatedInput from "../../../ValidatedInput"
import { fetchData } from "../../../../utils"
import "./ProductCreator.css"

export const productNamesFetcher = async () => {
  const res = await fetchData("/saviors/products/names");
  if (res.ok) {
    return res.content;
  } else {
    throw new Error(res.content);
  }
}

const ProductCreator = function ProductCreator() {

  const nav = useNavigate();
  const uniqueProductNames = useLoaderData();
  const [ name, setName ] = useState("");
  const [ _name, _setName ] = useState("");
  const [ error, setError ] = useState("");


  const update = e => {
    e.preventDefault();
    setName(e.target.elements["name"].value);
  }

  const onSubmit = async e => {
    e.preventDefault();
    const kwds = e.target.elements["keywords"].value;
    const _name = name.trim();
    const productId = await fetchData("saviors/products", "PUT");
    nav(`../${productId.content}/edit`, {state: {keywords: kwds, name: _name }, replace: true});
  }
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (_name && uniqueProductNames.includes(_name)) {
        setError("A product with that name has already been created");
      }
    }, 100);

    return () => clearTimeout(timeout);
    }, [_name]);

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
              onChange={e => {_setName(e.target.value); setError("")}}
            >
              {error && <p className="invalid-name">{error}</p>}
            </ValidatedInput>
            <button className="default-btn" type="submit" disabled={(!_name || error)}>
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