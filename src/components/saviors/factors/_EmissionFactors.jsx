import { memo } from "react";
import { Form, useLoaderData } from "react-router-dom";
import TextInput from "../../TextInput";
import { useEffect } from "react";
import { fetchData, formToObj, isObjectEmpty } from "../../../utils";
import { useState } from "react";
import Select from "react-select";
import { useRef } from "react";
import FactorsForm from "./FactorsForm";

export const factorsLoader = async ({ request, }) => {
  console.log(request.url, "i ran");
  return [1, 2];
}

const EmissionFactors = memo(function EmissionFactors() {
  const [ results, setResults ] = useState([]);



  return (
    <div className="factors">
      <FactorsForm setResults={setResults} />
      {
        results?.map(x => (
          <span>{ x.activity }</span>
        ))
      }
    </div>
  )
});

export default EmissionFactors