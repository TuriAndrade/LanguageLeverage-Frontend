import React from "react"
import { Link, useRouteMatch, useLocation } from "react-router-dom"
import {
  BsGrid3X3Gap,
  BsInfoCircle,
  MdTrendingUp,
  RiHomeLine,
  RiSettingsLine,
} from "react-icons/all"

export default function DefaultBottombar({ fullBorder }) {
  const home = useRouteMatch({
    path: "/",
    exact: true,
  })

  const trending = useRouteMatch({
    path: "/trending",
  })

  const about = useRouteMatch({
    path: "/about",
  })

  const preferences = useRouteMatch({
    path: "/preferences",
  })

  const categories = useRouteMatch({
    path: "/categories",
  })

  const location = useLocation()

  return (
    <div
      className={fullBorder ? "bottombar bottombar--fullborder" : "bottombar"}
    >
      <div className="bottombar__section">
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
            to="/trending"
            className={
              trending
                ? "bottombar__btn-icon bottombar__btn-icon--active"
                : "bottombar__btn-icon"
            }
          >
            <MdTrendingUp />
          </Link>
        </div>
        <div className="bottombar__item">
          <Link
            to={{
              pathname: "/preferences",
              state: {
                prevLocation: location.pathname,
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
            to="/about"
            className={
              about
                ? "bottombar__btn-icon bottombar__btn-icon--active"
                : "bottombar__btn-icon"
            }
          >
            <BsInfoCircle />
          </Link>
        </div>
        <div className="bottombar__item">
          <Link
            to={{
              pathname: "/categories",
              state: {
                prevLocation: location.pathname,
              },
            }}
            className={
              categories
                ? "bottombar__btn-icon bottombar__btn-icon--active"
                : "bottombar__btn-icon"
            }
          >
            <BsGrid3X3Gap />
          </Link>
        </div>
      </div>
    </div>
  )
}
