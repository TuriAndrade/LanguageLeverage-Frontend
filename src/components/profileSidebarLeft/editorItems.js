import React, { useContext } from "react"
import { UserContext } from "../context"
import { Link, useRouteMatch } from "react-router-dom"
import { BsFilePlus, FaRegEdit } from "react-icons/all"

export default function EditorItems() {
  const { user } = useContext(UserContext)

  const posts = useRouteMatch({
    path: "/posts",
  })

  const newPost = useRouteMatch({
    path: "/new/post",
  })

  return (
    <>
      {user && user.isEditor ? (
        <div className="sidebar__menu-item-box">
          <Link
            to="/posts"
            className={
              posts
                ? "sidebar__menu-item sidebar__menu-item--active"
                : "sidebar__menu-item"
            }
          >
            <div className="sidebar__menu-icon">
              <FaRegEdit />
            </div>
            <div className="sidebar__menu-text">Posts</div>
          </Link>
        </div>
      ) : null}
      {user && user.isEditor && user.isValidated ? (
        <div className="sidebar__menu-item-box">
          <Link
            to="/new/post"
            className={
              newPost
                ? "sidebar__menu-item sidebar__menu-item--active"
                : "sidebar__menu-item"
            }
          >
            <div className="sidebar__menu-icon">
              <BsFilePlus />
            </div>
            <div className="sidebar__menu-text">Novo post</div>
          </Link>
        </div>
      ) : null}
    </>
  )
}
