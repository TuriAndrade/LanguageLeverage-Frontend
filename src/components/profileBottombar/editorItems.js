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
        <div className="bottombar__item">
          <Link
            to="/posts"
            className={
              posts
                ? "bottombar__btn-icon bottombar__btn-icon--active"
                : "bottombar__btn-icon"
            }
          >
            <FaRegEdit />
          </Link>
        </div>
      ) : null}
      {user && user.isEditor && user.isValidated ? (
        <div className="bottombar__item">
          <Link
            to="/new/post"
            className={
              newPost
                ? "bottombar__btn-icon bottombar__btn-icon--active"
                : "bottombar__btn-icon"
            }
          >
            <BsFilePlus />
          </Link>
        </div>
      ) : null}
    </>
  )
}
