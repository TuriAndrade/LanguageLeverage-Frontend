import React, { useContext } from "react"
import { UserContext } from "../context"
import { Link, useRouteMatch } from "react-router-dom"
import { BsListUl, BiUser, VscKey } from "react-icons/all"

export default function AdminItems() {
  const { user } = useContext(UserContext)

  const editors = useRouteMatch({
    path: "/editors",
  })

  const admins = useRouteMatch({
    path: "/admins",
  })

  const posts = useRouteMatch({
    path: "/all/posts",
  })

  return (
    <>
      {user && user.isAdmin ? (
        <>
          <div className="bottombar__item">
            <Link
              to="/all/posts"
              className={
                posts
                  ? "bottombar__btn-icon bottombar__btn-icon--active"
                  : "bottombar__btn-icon"
              }
            >
              <BsListUl />
            </Link>
          </div>
          <div className="bottombar__item">
            <Link
              to="/editors"
              className={
                editors
                  ? "bottombar__btn-icon bottombar__btn-icon--active"
                  : "bottombar__btn-icon"
              }
            >
              <BiUser />
            </Link>
          </div>
        </>
      ) : null}
      {user && user.isAdmin && user.hasFullPermission ? (
        <div className="bottombar__item">
          <Link
            to="/admins"
            className={
              admins
                ? "bottombar__btn-icon bottombar__btn-icon--active"
                : "bottombar__btn-icon"
            }
          >
            <VscKey />
          </Link>
        </div>
      ) : null}
    </>
  )
}
