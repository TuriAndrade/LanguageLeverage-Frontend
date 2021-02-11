import React, { useRef, useEffect, useState } from "react"
import { CSSTransition } from "react-transition-group"

export default function LazyImage({ alt, ...rest }) {
  const [isVisible, setIsVisible] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  const observer = useRef()
  const lazyImage = useRef()

  useEffect(() => {
    if (observer.current) observer.current.disconnect()

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setIsVisible(true)
      }
    })

    if (lazyImage.current) observer.current.observe(lazyImage.current)
  }, [observer, lazyImage])

  return isVisible ? (
    <CSSTransition in={isLoaded} timeout={600} classNames="lazyImage">
      <img
        {...rest}
        ref={lazyImage}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        style={!isLoaded ? { display: "none" } : null}
      ></img>
    </CSSTransition>
  ) : (
    <div
      ref={lazyImage}
      style={{
        visibility: "hidden",
        pointerEvents: "none",
        zIndex: "-100",
        width: "0",
        height: "0",
      }}
    ></div>
  )
}
