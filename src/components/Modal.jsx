import { useState } from "react";
import Header from "./Header";
import "./Modal.css"
import { useEffect } from "react";


export default function Modal({ 
  containerStyle, 
  backgroundColor="var(--sidebar-bg)", 
  children,
  visible,
  titleText,
  close,
  titleSize="med",
  className,
  showClose=true,
  small=false,
  closeText="close"
}) {

  return visible && (
  <div className="full-space">
    <div className="popup-fill" />
    <div 
      className={`popup-card popup-fill ${className} ${small ? "small" : ""}`}
      style={{...containerStyle, backgroundColor }}
    >
        
      {titleText && 
        <Header 
        fontSize={titleSize}
        text={titleText}
        className="heading"
        >
          {
            showClose && !small &&
          <button
          className="white-hov"
          onClick={close}
          >
            <span className="material-symbols-rounded">close</span>
          </button>
          }
        </Header>
        }
      { children }
      {
        showClose && small && (
          <div className="close">
            <button onClick={close}>{ closeText }</button>
          </div>
        )
      }
    </div>
    </div>
  )
}