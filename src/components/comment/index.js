import React, { useState, useContext } from "react"
import { CSSTransition } from "react-transition-group"
import getTimePassed from "../../utils/getTimePassed"
import api from "../../services/api"
import { atMost200 } from "../../validators/general"
import { CsrfContext, UserContext } from "../context"
import CommentModal from "../commentModal"
import { GoVerified } from "react-icons/all"

export default function Comment({
  comment,
  insertComment,
  setError,
  setSuccess,
  setPopupIn,
}) {
  const [replyInputIn, setReplyInputIn] = useState(false)
  const [reply, setReply] = useState("")

  const { csrfToken } = useContext(CsrfContext)
  const { user } = useContext(UserContext)

  const [commentIn, setCommentIn] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()

    if (reply) {
      if (
        (localStorage.getItem("name") && localStorage.getItem("email")) ||
        (user && !user.loading)
      ) {
        try {
          const response = await api.post(
            "/comment",
            {
              name: localStorage.getItem("name") || undefined,
              email: localStorage.getItem("email") || undefined,
              text: reply,
              replyTo: comment.replyTo || comment.id,
              articleId: comment.articleId,
            },
            {
              withCredentials: true,
              headers: {
                csrftoken: csrfToken,
              },
            }
          )

          const createdComment = response.data.comment

          setError(null)
          setSuccess(true)
          setReply("")
          insertComment({
            articleId: comment.articleId,
            comment: createdComment,
          })
        } catch (e) {
          console.log(e.response)
          setError("Algum erro aconteceu!")
          setSuccess(false)
        } finally {
          setPopupIn(true)
          setReplyInputIn(false)
        }
      } else {
        setCommentIn(true)
        setReplyInputIn(false)
      }
    }
  }

  function convertTime(timestamp) {
    const time = getTimePassed(timestamp)

    if (!time) {
      return "Data não encontrada!"
    } else {
      return `${time.n}${time.unit}`
    }
  }

  return (
    <div
      className={
        comment.replyTo ? "post-comment post-comment--reply" : "post-comment"
      }
    >
      <CommentModal
        modalIn={commentIn}
        setModalIn={setCommentIn}
        comment={reply}
        articleId={comment.articleId}
        setError={setError}
        replyTo={comment.replyTo || comment.id}
        setSuccess={setSuccess}
        setPopupIn={setPopupIn}
        setComment={setReply}
        insertComment={insertComment}
      />
      <div className="post-comment__header">
        <div className="post-comment__header--primary">{comment.name}</div>
        {comment.userType === "editor" ? (
          <div className="post-comment__header--green-icon">
            <GoVerified />
          </div>
        ) : comment.userType === "admin" ? (
          <div className="post-comment__header--primary-icon">
            <GoVerified />
          </div>
        ) : null}
        <div className="post-comment__header--secondary">
          {convertTime(new Date(comment.createdAt).getTime())}
        </div>
        {!comment.replyTo ? (
          <button
            onClick={() => setReplyInputIn((prevState) => !prevState)}
            className="post-comment__reply-btn"
          >
            {replyInputIn ? "Close" : "Reply"}
          </button>
        ) : null}
      </div>
      <div className="post-comment__text">{comment.text}</div>
      <CSSTransition
        in={replyInputIn}
        timeout={2000}
        classNames="post-comment__reply-input"
        unmountOnExit
      >
        <form onSubmit={handleSubmit}>
          <input
            onChange={(e) => atMost200(e.target.value, setReply)}
            value={reply}
            placeholder="Comente aqui"
            className="post-comment__reply-input"
          ></input>
        </form>
      </CSSTransition>
    </div>
  )
}
