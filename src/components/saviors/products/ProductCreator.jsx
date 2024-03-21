import { useEffect, useState } from "react"
import { useLoaderData, useNavigate } from "react-router-dom"
import ValidatedInput from "../../ValidatedInput"
import { fetchData, getFetchHeaders } from "../../../utils"
import "./ProductCreator.css";
import FileUploader from "../data/FileUploader";

export const productNamesFetcher = async () => {
  const res = await fetchData("/saviors/products/names");
  return res.content;
}

const ProductCreator = function ProductCreator() {

  const nav = useNavigate();
  const uniqueProductNames = useLoaderData();
  const [ name, setName ] = useState("");
  const [ error, setError ] = useState("");
  const [ step, setStep ] = useState(1);


  const onSubmit = async e => {
    e.preventDefault();
    console.log("hhhhhere");

    let res = await fetch("http://localhost:8000/products", {
      method: "POST",
      headers: getFetchHeaders(),
      body: new FormData(e.target),
      credentials: "include",
    })
    if (res.ok) {
      res = await res.json()
    } else if (res.status === 409) {
      setError("A product with that name has already been created");
    }
  }

  const toStepTwo = () => {
    if (uniqueProductNames.includes(name)) {
      setError("A product with that name has already been created");
    } else {
      setStep(2);
    };
  };


  return (
    <div className="product-creator">
    <form 
      className="field full-space" 
      style={{ gap: name ? 20 : 30}}
      key="name" 
      action="" 
      onSubmit={onSubmit}
    > 
    <div className="name full-space" style={{ display: step === 1 ? "flex" : "none"}}>
          <ValidatedInput 
            inputClass="input"
            label="name of product"
            message="please choose a name"
            name="name"
            onChange={e => {setName(e.target.value)}}
          />
        <button 
          className="default-btn" 
          type="button" 
          disabled={!name} 
          onClick={toStepTwo}
          >
          next
        </button>
          {error && <p className="invalid-name">{error}</p>}
      </div>
        <div className="full-space" style={{ display: step === 2 ? "block" : "none" }}>
          <FileUploader title="Upload product data" />
          <button className="default-btn">submit</button>
        </div>
      </form>
    </div>
  )
}

export default ProductCreator