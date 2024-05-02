import { MouseEvent, useState } from "react";
import { Header } from "../header/Header";
import "./SlideUpModal.css";
import { BaseModalProps } from "./types";
const FADE_OUT_MS = 300;

/**
 * A wrapper component that renders a modal which will slide up 
 * from the outside-bottom of the window.
 * 
 * @param  props
 * @param  visible - Whether the modile should currently be visible.
 * @param  close - A function that sets `visible` to `false` when called.
 * @param title - A title to render at the top of this modal. Rendered by a `<Header />` component.
 * @param titlesize="1.1em" - The fontsize of `title`.
 * @param  children - The modal content to render.
 * @returns The modal wrapping the provided `children`.
 */
export function SlideUpModal({ 
  visible, 
  close, 
  titleText, 
  titleSize="default",
  children
 }: BaseModalProps) {
  const [ fadeOut, setFadeOut ] = useState<boolean>(false);

  // A fade out animation
  function _close(e: MouseEvent<HTMLButtonElement>) {
    setFadeOut(true);
    setTimeout(() => {
      close(e);
      setFadeOut(false);
    }, FADE_OUT_MS - 10);
  };

  return visible && (
    <div className="modal-slide-up" 
    style={{ opacity: fadeOut ? 0 : 1, transition: `opacity ${FADE_OUT_MS}ms ease-in-out`}}
    >
      <div className="overlay" style={{ animationDelay: visible ? "0.15s" : "0"}}/>
      <div className="content">
      {titleText && <Header text={titleText} fontSize={titleSize}>
        <div className="close">
          <button onClick={_close}>
            <span className="material-symbols-rounded">close</span>
          </button>
        </div>
      </Header>
      }
      { children }
      </div>
    </div>
  )
}