import React, { useState, useContext, useEffect } from "react"
import { CSSTransition } from "react-transition-group"
import { UserContext } from "../context"
import UseAnimation from "react-useanimations"
import loading from "react-useanimations/lib/loading"

export default function Loading() {
  const [loadingIn, setLoadingIn] = useState(true)
  const { user } = useContext(UserContext)

  useEffect(() => {
    if (user && user.loading) {
      setLoadingIn(true)
    } else {
      setLoadingIn(false)
    }
  }, [setLoadingIn, user])

  return (
    <CSSTransition
      in={loadingIn}
      timeout={{ enter: 200, appear: 200, exit: 0 }}
      appear
      classNames="loading"
      unmountOnExit
    >
      <div className="loading">
        <UseAnimation
          wrapperStyle={{ width: "10rem", height: "10rem" }}
          animation={loading}
          strokeColor="#0092db"
        />
      </div>
    </CSSTransition>
  )
}
