import { RefObject, useEffect, useState } from "react"

/**
 * A hook that returns a boolean state value indicating if the provided element is currently 
 * in the viewport.
 * 
 * Built on the `IntersectionObserver` api.
 * 
 * @param ref - A react ref of the element to track.
 * @param options - `IntersectionObserver` customization options.
 * @param options.observerInitFn - A callback functin that recieves the
 * `IntersectionObserver`'s entry. Should return a boolean whether to update visibility to true.
 * @param options.observerOptions - Passed as options when initiaintg the IntersectionObserver 
 * @returns a boolean indicating whether or not the element is visible
 */

export const useIsElementInViewport = (
  ref: RefObject<HTMLElement>, 
  options?: {
    observerInitFn?: (e: IntersectionObserverEntryInit) => boolean,
    observerOptions?: IntersectionObserverInit
  }
) => {
  const [ isVisible, setIsVisible ] = useState<null|Boolean>(null);
  
  const { 
    observerInitFn = (e: IntersectionObserverEntryInit) => e.isIntersecting,
    observerOptions={}
  } = (options || {});

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([ e ]) => { observerInitFn(e) && setIsVisible(true) },
      observerOptions,
    );
    if (ref.current) {
      observer.observe(ref.current);
    };
    return () => observer.disconnect();
  }, [ref])

  return isVisible;
};