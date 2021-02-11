import React, { useRef, useEffect, useState } from "react"

export default function LazyImage({ src, alt }) {
  const [isVisible, setIsVisible] = useState(false)

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

  return <img ref={lazyImage} src={isVisible ? src : null} alt={alt}></img>
}
