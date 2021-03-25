import React, { useState } from "react"
import { CSSTransition } from "react-transition-group"

export default function Image({
  containerClass,
  withPlaceholder,
  placeholderClass,
  alt,
  ...rest
}) {
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <div className={containerClass}>
      <CSSTransition in={isLoaded} timeout={600} classNames="lazyImage">
        <img
          {...rest}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          style={!isLoaded ? { display: "none" } : null}
        ></img>
      </CSSTransition>
      {withPlaceholder && !isLoaded ? (
        <div className={placeholderClass}></div>
      ) : null}
    </div>
  )
}
