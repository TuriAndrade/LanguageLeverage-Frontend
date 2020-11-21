import React from "react"
import { CSSTransition } from "react-transition-group"
import UseAnimation from "react-useanimations"
import loading from "react-useanimations/lib/loading"

export default function LoadingContent({ loadingIn }) {
  return (
    <CSSTransition
      in={loadingIn}
      timeout={{ enter: 200, appear: 200, exit: 0 }}
      appear
      classNames="loading-content"
      unmountOnExit
    >
      <div className="loading-content">
        <UseAnimation
          wrapperStyle={{ width: "7rem", height: "7rem" }}
          animation={loading}
          strokeColor="#0092db"
        />
        <div className="loading-content__text">Loading</div>
      </div>
    </CSSTransition>
  )
}
