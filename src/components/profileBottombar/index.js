import React, { useState } from "react"
import { Link, useRouteMatch, useLocation } from "react-router-dom"
import {
  CgProfile,
  CgLogOut,
  RiHomeLine,
  RiSettingsLine,
  BiPlusCircle,
  BiMinusCircle,
} from "react-icons/all"

import EditorItems from "./editorItems"
import AdminItems from "./adminItems"
import { CSSTransition } from "react-transition-group"

export default function ProfileBottombar() {
  const [section1In, setSection1In] = useState(true)
  const [section2In, setSection2In] = useState(false)

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
      <CSSTransition
        in={section1In}
        classNames="bottombar__section--1"
        timeout={400}
        unmountOnExit
      >
        <div className="bottombar__section bottombar__section--1">
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
          <div className="bottombar__item">
            <button
              onClick={() => {
                setSection1In(false)
                setSection2In(true)
              }}
              className="bottombar__btn-icon"
            >
              <BiPlusCircle />
            </button>
          </div>
        </div>
      </CSSTransition>
      <CSSTransition
        in={section2In}
        classNames="bottombar__section--2"
        timeout={400}
        unmountOnExit
      >
        <div className="bottombar__section bottombar__section--2">
          <EditorItems />
          <AdminItems />
          <div className="bottombar__item">
            <button
              onClick={() => {
                setSection1In(true)
                setSection2In(false)
              }}
              className="bottombar__btn-icon"
            >
              <BiMinusCircle />
            </button>
          </div>
        </div>
      </CSSTransition>
    </div>
  )
}
