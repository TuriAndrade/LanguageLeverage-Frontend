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
          <div className="sidebar__menu-item-box">
            <Link
              to="/all/posts"
              className={
                posts
                  ? "sidebar__menu-item sidebar__menu-item--active"
                  : "sidebar__menu-item"
              }
            >
              <div className="sidebar__menu-icon">
                <BsListUl />
              </div>
              <div className="sidebar__menu-text">Todos os posts</div>
            </Link>
          </div>
          <div className="sidebar__menu-item-box">
            <Link
              to="/editors"
              className={
                editors
                  ? "sidebar__menu-item sidebar__menu-item--active"
                  : "sidebar__menu-item"
              }
            >
              <div className="sidebar__menu-icon">
                <BiUser />
              </div>
              <div className="sidebar__menu-text">Editors</div>
            </Link>
          </div>
        </>
      ) : null}
      {user && user.isAdmin && user.hasFullPermission ? (
        <div className="sidebar__menu-item-box">
          <Link
            to="/admins"
            className={
              admins
                ? "sidebar__menu-item sidebar__menu-item--active"
                : "sidebar__menu-item"
            }
          >
            <div className="sidebar__menu-icon">
              <VscKey />
            </div>
            <div className="sidebar__menu-text">Admins</div>
          </Link>
        </div>
      ) : null}
    </>
  )
}
