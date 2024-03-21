import { useRef } from "react";
import Header from "../../../Header";
import Rating from "../../../Rating";
import { STAGE_ICONS } from "../../../products/StageDropdown";

export default function ProcessEditorTitle({ processName, productName, stageName, }) {

  const inputRef = useRef();

  return (
    <div className="title">
      <Rating size={60} rating="good">
      <span 
        className="material-symbols-rounded filled"
      style={{ color: "black", fontSize: 38 }}
      >
        {STAGE_ICONS[stageName]}
      </span>
    </Rating>
    <div className="title-wrapper">
    <Header
      text={[productName, stageName, processName].join(" / ")
      }/>
    </div>
    <button className="white-hov" onClick={() => inputRef?.current?.focus()}>
      <span className="material-symbols-rounded">edit</span>
    </button>
  </div>
  )
}