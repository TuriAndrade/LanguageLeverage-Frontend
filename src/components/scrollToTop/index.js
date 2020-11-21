import React, { useLayoutEffect } from "react"

export default function scrollToTop({ component: Component }) {
  return function ScrollToTopComponent(props) {
    useLayoutEffect(() => {
      window.scrollTo(0, 0)
    }, [])

    return <Component {...props} />
  }
}
