import { useRef } from "react";
import { Header } from "../../../header/Header";
import Rating from "../../../products/Rating";
import { ProcessEditorTitleProps } from "./types";
import { STAGE_ICONS } from "../../../products/constants";

export function ProcessEditorTitle({ 
  processName,
  productName,
  stageName,
}: ProcessEditorTitleProps) {

  const inputRef = useRef<HTMLInputElement>();

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