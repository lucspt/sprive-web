import { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";
import SelectInput from "../../SelectInput";
import { fetchData, isObjectEmpty, formToObj } from "../../../utils";


const style = {
  control: base => ({
    ...base,
    border: 0,
    color: "var(--black)",
    cursor: "text",
  }),
  container: base => ({
    ...base,
    color: "var(--black)",
    maxWidth: 250,
  }),
  option: base => ({
    ...base,
    color: "var(--black)"
  })
};

export default function FactorsForm({ setResults }) {
  const submitRef = useRef();
  const [ textSearch, setTextSearch ] = useState("");
  const [ possibilities, setPossibilities ] = useState({});
  const formRef = useRef();

    
  useEffect(() => {
    if (isObjectEmpty(possibilities)) {
      async function getPossibilities() {
        console.log("possi ran")
        const res = await fetchData("factors/possibilities");
        const formattedPossibilities = {};
        Object.entries(res.content)
        .map(([ field, possibs ]) => {
          Object.assign(formattedPossibilities, {
            [field]: possibs.map(x => ({label: x, value: x}))
          });
        });
        setPossibilities(formattedPossibilities);
      };
      getPossibilities();
    }
  }, [])


  useEffect(() => {
    let timeout;
    if (textSearch) {
      async function getFactors() {
        const formData = [];
        Object
        .entries({ ...formToObj(formRef.current), activity: textSearch })
        .map(([ k, v ]) => formData.push(`${k}=${v}`))
        const res = await fetchData(`factors?${formData.join("&")}`)
        setResults(res.content);
      }
     timeout = setTimeout(getFactors, 250);
    }

    return () => clearTimeout(timeout);
  }, [textSearch])

  return (
    <form ref={formRef}>
      <SelectInput 
        name="activity"
        options={possibilities.activity} 
        isClearable 
        isSearchable
        className="dropdown"
        theme={(theme) => ({
          ...theme,
          colors: {
            ...theme.colors, 
            primary: "var(--calm-blue)",
            danger: "var(--eco-danger)",

          }
        })}
        styles={style}
        onInputChange={x => x && setTextSearch(x)}
        onChange={(selected) => selected && setTextSearch(selected.value)}
      />
  </form>
  )
}