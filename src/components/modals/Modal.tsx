import { Header } from "../header/Header";
import "./Modal.css"
import { ModalProps } from "./types";

/**
 * A component that renders a popup overlaying the current page's content.
 * 
 * 
 * @param props 
 * to the style prop of the content's container
 * @param props.visible - If true, render the modal and `props.children`.
 * @param  props.close - A function that sets `visible` to `false`
 * @param  props.containerStyle - An object to pass 
 * @param  props.backgroundColor - The content container's background color
 * @param  props.children - The content to render within the container
 * @param  props.titleText - Header text to render with the container
 * @param  props.titleSize - THis prop is passed to the `<Header />` that renders `titleText`
 * @param  props.className - Passed to the container's className prop.
 * @param props.showClose - Show's a close button when true.
 * @param  props.small=false - Renders a smaller container with a 'small' className.
 * @param props.closeText - Only relevant when `props.small` is true. The text of the close button.
 * @param  props.adjustCenterForSidebar - Adjust the position of this modal to be in what looks like the
 * 'center' of the screen when <DashboardRouter /> (the sidebar) component is present. 
 * @param  props.containerProps - Additional props to pass to the contanier `<div>`
 * @returns The modal container wrapping the `children` passed to it.
 */
export function Modal({ 
  visible,
  close,
  containerStyle, 
  backgroundColor="var(--darker)", 
  children,
  titleText,
  titleSize="med",
  className,
  showClose=true,
  small=false,
  closeText="close",
  adjustCenterForSidebar=false,
  ...containerProps
}: ModalProps) {

  return visible && (
  <div className="full-space">
    <div className="popup-fill" />
    <div 
      className={`popup-card popup-fill ${className} ${small ? "small" : ""} ${adjustCenterForSidebar ? "center" : ""}`}
      style={{...containerStyle, backgroundColor }}
      {...containerProps}
    >
        
      {
        titleText ?
          <Header 
          fontSize={titleSize}
          text={titleText}
          className="heading"
          >
            {showClose && !small && 
            <button
              className="white-hov"
              onClick={close}
            >
              <span className="material-symbols-rounded">close</span>
            </button>
            }
          </Header>
        : showClose && !small && (
            <button
              className="white-hov close align-end"
              onClick={close}
            >
              <span className="material-symbols-rounded">close</span>
            </button>
          )
        }
        <div className="full-space modal-content">{ children }</div>
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