import React, { useState, useContext } from "react"
import { CSSTransition } from "react-transition-group"
import getTimePassed from "../../utils/getTimePassed"
import api from "../../services/api"
import { atMost200 } from "../../validators/general"
import { CsrfContext, UserContext } from "../context"
import CommentModal from "../commentModal"
import { GoVerified } from "react-icons/all"
import UseAnimation from "react-useanimations"
import loading from "react-useanimations/lib/loading"

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

  const [loadingReply, setLoadingReply] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()

    if (reply && !loadingReply) {
      if (
        (localStorage.getItem("name") && localStorage.getItem("email")) ||
        (user && !user.loading)
      ) {
        try {
          setLoadingReply(true)
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

          setReply("")
          insertComment(createdComment)
        } catch (e) {
          setError("Algum erro aconteceu!")
          setPopupIn(true)
        } finally {
          setReplyInputIn(false)
          setLoadingReply(false)
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
        <form
          className="post-content__comments-input-box"
          onSubmit={handleSubmit}
        >
          <input
            onChange={(e) => atMost200(e.target.value, setReply)}
            value={reply}
            placeholder="Comente aqui"
            className={
              loadingReply
                ? "post-comment__reply-input post-comment__reply-input--loading"
                : "post-comment__reply-input"
            }
          />
          {loadingReply ? (
            <div className="post-content__comments-loading">
              <UseAnimation
                wrapperStyle={{ width: "3rem", height: "3rem" }}
                animation={loading}
                strokeColor="#fff"
              />
            </div>
          ) : null}
        </form>
      </CSSTransition>
    </div>
  )
}
