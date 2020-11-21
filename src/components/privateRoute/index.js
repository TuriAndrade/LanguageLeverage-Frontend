import React, { useContext } from "react"

import { Route, Redirect } from "react-router-dom"

import { UserContext } from "../context"

import Loading from "../loading"

export default function PrivateRoute({
  component: Component,
  editorOnly,
  validatedEditorOnly,
  adminOnly,
  fullAdminOnly,
  ...rest
}) {
  const { user } = useContext(UserContext)

  if (user && user.loading) {
    return <Loading />
  }

  if (editorOnly) {
    return (
      <Route
        {...rest}
        render={(routeProps) =>
          user && user.isEditor ? (
            <Component {...routeProps} />
          ) : user ? (
            <Redirect to="/profile" />
          ) : (
            <Redirect to="/" />
          )
        }
      />
    )
  }

  if (validatedEditorOnly) {
    return (
      <Route
        {...rest}
        render={(routeProps) =>
          user && user.isEditor && user.isValidated ? (
            <Component {...routeProps} />
          ) : user ? (
            <Redirect to="/profile" />
          ) : (
            <Redirect to="/" />
          )
        }
      />
    )
  }

  if (adminOnly) {
    return (
      <Route
        {...rest}
        render={(routeProps) =>
          user && user.isAdmin ? (
            <Component {...routeProps} />
          ) : user ? (
            <Redirect to="/profile" />
          ) : (
            <Redirect to="/" />
          )
        }
      />
    )
  }

  if (fullAdminOnly) {
    return (
      <Route
        {...rest}
        render={(routeProps) =>
          user && user.isAdmin && user.hasFullPermission ? (
            <Component {...routeProps} />
          ) : user ? (
            <Redirect to="/profile" />
          ) : (
            <Redirect to="/" />
          )
        }
      />
    )
  }

  return (
    <Route
      {...rest}
      render={(routeProps) =>
        user ? <Component {...routeProps} /> : <Redirect to="/" />
      }
    />
  )
}
