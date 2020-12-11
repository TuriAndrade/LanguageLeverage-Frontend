import React from "react"
import scrollToTop from "../../components/scrollToTop"
import { FaTimesCircle } from "react-icons/all"

function About() {
  return (
    <div className="no-content">
      <div className="no-content__icon no-content__icon--red">
        <FaTimesCircle />
      </div>
      <div className="no-content__text no-content__text--red">Em breve!</div>
    </div>
  )
}

export default scrollToTop({ component: About })
