import { FormEvent, useState } from "react"
import { useLoaderData, useNavigate } from "react-router-dom"
import { BaseInput } from "../../inputs/base/BaseInput";
import { fetchWithAuth } from "../../../utils/utils"
import "./ProductCreator.css";
import { FileInput } from "../../inputs/file/FileInput";
import { SpriveResponse } from "../../../types";

export const ProductCreator = function ProductCreator() {

  const nav = useNavigate();
  const uniqueProductNames = useLoaderData() as string[];
  const [ name, setName ] = useState("");
  const [ error, setError ] = useState("");
  const [ step, setStep ] = useState(1);

  const productNameTakenMsg = "A product with that name has already been created"

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let res = await fetchWithAuth(
      "http://localhost:8000/products", 
      { 
        body: new FormData(e.currentTarget), 
        stringifyBody: false, 
        isFileUpload: true,
        method: "POST",
      },
    );
    const { content } = (res as SpriveResponse<string>);
    if (content) {
      nav(`../${content}`, { replace: true });
    } else if ((res as Response).status === 409) {
      setError(productNameTakenMsg);
    }
  }

  const toStepTwo = () => {
    if (uniqueProductNames.includes(name)) {
      setError(productNameTakenMsg);
    } else {
      setStep(2);
    };

  };


  return (
    <div className="product-creator">
      <form 
        className="field full-space" 
        key="name" 
        action="" 
        onSubmit={onSubmit}
      > 
        <div className="name full-space" style={{ display: step === 1 ? "flex" : "none"}}>
          <div className="input-container">
            <div className="error-rel">
              <BaseInput 
                name="name" 
                label="Enter product name" 
                onChange={e => setName(e.target.value)}
                />
                {error && <span className="error">{error}</span>}
            </div>
            <button 
              className="default-btn" 
              type="button" 
              disabled={!name} 
              onClick={toStepTwo}
              >
              Next
            </button>
          </div>
        </div>
        <div className="full-space" style={{ display: step === 2 ? "block" : "none" }}>
          <FileInput 
            title="Upload product data" 
            requiredColumns={["activity", "stage", "unit"]} 
            submitBtn={true}
          />
        </div>
      </form>
    </div>
  )
};