import React from "react"
import { Link, useRouteMatch, useLocation } from "react-router-dom"
import {
  CgProfile,
  CgLogOut,
  RiHomeLine,
  RiSettingsLine,
} from "react-icons/all"

import EditorItems from "./editorItems"
import AdminItems from "./adminItems"

export default function ProfileBottombar() {
  const home = useRouteMatch({
    path: "/",
    exact: true,
  })

  const profile = useRouteMatch({
    path: "/profile",
  })

  const preferences = useRouteMatch({
    path: "/preferences",
  })

  const logout = useRouteMatch({
    path: "/logout",
  })

  const location = useLocation()

  return (
    <div className="bottombar">
      <div className="bottombar__item">
        <Link
          to="/"
          className={
            home
              ? "bottombar__btn-icon bottombar__btn-icon--active"
              : "bottombar__btn-icon"
          }
        >
          <RiHomeLine />
        </Link>
      </div>
      <div className="bottombar__item">
        <Link
          to="/profile"
          className={
            profile
              ? "bottombar__btn-icon bottombar__btn-icon--active"
              : "bottombar__btn-icon"
          }
        >
          <CgProfile />
        </Link>
      </div>
      <div className="bottombar__item">
        <Link
          to={{
            pathname: "/preferences",
            state: {
              prevLocation: location.pathname,
              user: {
                isEditor: true,
              },
            },
          }}
          className={
            preferences
              ? "bottombar__btn-icon bottombar__btn-icon--active"
              : "bottombar__btn-icon"
          }
        >
          <RiSettingsLine />
        </Link>
      </div>
      <EditorItems />
      <AdminItems />
      <div className="bottombar__item">
        <Link
          to="/logout"
          className={
            logout
              ? "bottombar__btn-icon bottombar__btn-icon--active"
              : "bottombar__btn-icon"
          }
        >
          <CgLogOut />
        </Link>
      </div>
    </div>
  )
}
