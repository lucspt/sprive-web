import { OnClickFn } from "../../types";
import { Header } from "../header/Header";
import "./SideModal.css";
import { SideModalProps } from "./types";

/**
 * A modal that slides in from the (right) outside of the browser window, horizontally.
 * 
 * @param props 
 * @param props.children - The content to render inside the modal. 
 * @param props.visible - Whether or not should be currently visible
 * @param props.close - A function that sets `visible` to false
 * @param props.contentWidth - The width of the modal
 * @param props.backgroundColor - The modal's bg color
 * @param props.closeComponent - A component to render as the close button
 * @param props.title - The title to render a `<Header />` with, at the top of the modal.
 * @returns A react component
 */
export function SideModal({ 
  children, 
  visible, 
  close, 
  contentWidth="45%", 
  backgroundColor= "var(--darker)",
  closeComponent,
  titleText
 }: SideModalProps) {
  console.log(closeComponent);

    return visible && (
      <div className="side-modal">
      <div className="opacity" />
      <div className="modal-content" style={{ width: contentWidth, backgroundColor }}>
        {
          closeComponent 
            ?  closeComponent
            : titleText && ( 
              <Header text={titleText} className="header-close">
                <div className="close">
                  <button onClick={close as OnClickFn}>
                    <span className="material-symbols-rounded">close</span>
                  </button>
                </div>
              </Header>
          )
        }
        <div className="content-wrapper">
          { children }
        </div>
      </div>
    </div>
  )
}