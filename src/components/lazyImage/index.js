import React, { useRef, useEffect, useState } from "react"
import { CSSTransition } from "react-transition-group"

export default function LazyImage({
  containerClass,
  withPlaceholder,
  placeholderClass,
  alt,
  ...rest
}) {
  const [isVisible, setIsVisible] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  const observer = useRef()
  const container = useRef()

  useEffect(() => {
    if (observer.current) observer.current.disconnect()

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setIsVisible(true)
      }
    })

    if (container.current) observer.current.observe(container.current)
  }, [observer, container])

  return (
    <div ref={container} className={containerClass}>
      {isVisible ? (
        <CSSTransition in={isLoaded} timeout={600} classNames="lazyImage">
          <img
            {...rest}
            alt={alt}
            onLoad={() => setIsLoaded(true)}
            style={!isLoaded ? { display: "none" } : null}
          ></img>
        </CSSTransition>
      ) : null}
      {withPlaceholder && !isLoaded ? (
        <div className={placeholderClass}></div>
      ) : null}
    </div>
  )
}
