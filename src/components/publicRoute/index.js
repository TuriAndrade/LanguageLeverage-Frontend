import React, { useContext } from "react"

import { Route, Redirect } from "react-router-dom"

import { UserContext } from "../context"

import Loading from "../loading"

export default function PublicRoute({
  component: Component,
  restricted,
  ...rest
}) {
  const { user } = useContext(UserContext)

  if (!restricted) {
    return (
      <Route {...rest} render={(routeProps) => <Component {...routeProps} />} />
    )
  }

  if (user && user.loading) {
    return <Loading />
  }

  return (
    <Route
      {...rest}
      render={(routeProps) =>
        restricted && user ? (
          <Redirect to="/profile" />
        ) : (
          <Component {...routeProps} />
        )
      }
    />
  )
}
