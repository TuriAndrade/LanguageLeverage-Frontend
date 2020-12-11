import React, { useState, useContext, useRef, useEffect } from "react"
import Comment from "../comment"
import { CsrfContext, UserContext } from "../context"
import CommentModal from "../commentModal"
import LikeModal from "../likeModal"
import {
  AiOutlineHeart,
  AiFillHeart,
  AiOutlineShareAlt,
  AiOutlinePlusCircle,
  AiOutlineMinusCircle,
  GoComment,
} from "react-icons/all"
import getTimePassed from "../../utils/getTimePassed"
import DefaultProfilePicture from "../../assets/default-profile-picture.png"
import { atMost200 } from "../../validators/general"
import api from "../../services/api"
import PopupMessage from "../popupMessage"

export default function Post({
  article,
  fowardedRef,
  insertComment,
  insertLike,
}) {
  const [isOpened, setIsOpened] = useState(false)
  const [comment, setComment] = useState("")
  const [commentIn, setCommentIn] = useState(false)
  const [likeIn, setLikeIn] = useState(false)
  const [popupIn, setPopupIn] = useState(false)

  const [scrollToComments, setScrollToComments] = useState(false)

  const [error, setError] = useState(null)

  const [success, setSuccess] = useState(null)

  const { csrfToken } = useContext(CsrfContext)
  const { user } = useContext(UserContext)

  const commentInput = useRef()

  useEffect(() => {
    if (isOpened && scrollToComments && commentInput && commentInput.current) {
      commentInput.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "end",
      })

      setScrollToComments(false)
    }
  }, [isOpened, scrollToComments])

  function convertTime(timestamp) {
    const time = getTimePassed(timestamp)

    if (!time) {
      return "Data não encontrada!"
    } else {
      return `${time.n}${time.unit}`
    }
  }

  async function handleLike() {
    if (!article.isLiked) {
      if (
        (localStorage.getItem("name") && localStorage.getItem("email")) ||
        (user && !user.loading)
      ) {
        try {
          const response = await api.post(
            "/like",
            {
              email: localStorage.getItem("email") || undefined,
              articleId: article.id,
            },
            {
              withCredentials: true,
              headers: {
                csrftoken: csrfToken,
              },
            }
          )

          const createdLike = response.data.like

          insertLike({ articleId: article.id, comment: createdLike })
        } catch (e) {
          setError("Algum erro aconteceu!")
          setPopupIn(true)
        }
      } else {
        setLikeIn(true)
      }
    }
  }

  async function handleComment(e) {
    e.preventDefault()

    if (comment) {
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
              text: comment,
              articleId: article.id,
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
          setComment("")
          insertComment({ articleId: article.id, comment: createdComment })
        } catch (e) {
          setError("Algum erro aconteceu!")
          setSuccess(false)
        } finally {
          setPopupIn(true)
        }
      } else {
        setCommentIn(true)
      }
    }
  }

  return (
    <div ref={fowardedRef} className="post-box">
      <PopupMessage
        modalIn={popupIn}
        setModalIn={setPopupIn}
        error={error}
        setError={setError}
        sucess={success}
        setSuccess={setSuccess}
      />
      <CommentModal
        modalIn={commentIn}
        setModalIn={setCommentIn}
        comment={comment}
        articleId={article.id}
        setError={setError}
        setSuccess={setSuccess}
        setPopupIn={setPopupIn}
        setComment={setComment}
        insertComment={insertComment}
      />
      <LikeModal
        modalIn={likeIn}
        setModalIn={setLikeIn}
        articleId={article.id}
        setError={setError}
        setSuccess={setSuccess}
        setPopupIn={setPopupIn}
        setComment={setComment}
        insertLike={insertLike}
      />
      <div className="post-header">
        <div className="post-header__header">
          <div className="post-header__profile-picture">
            <img
              src={
                (article.Editor &&
                  article.Editor.User &&
                  article.Editor.User.picture) ||
                DefaultProfilePicture
              }
              alt="EditorPic"
            />
          </div>
          <div className="post-header__login">
            <div className="post-header__login--text">
              {article.Editor.User.login}
            </div>
          </div>
          <div className="post-header__publish-time">
            {convertTime(new Date(article.createdAt).getTime())}
          </div>
        </div>
        <div className="post-header__cover">
          <img src={article.cover} alt="Capa" />
        </div>
        <div className="post-header__btn-box">
          <div className="post-header__btn">
            <button
              onClick={() => {
                setIsOpened(true)
                setScrollToComments(true)
              }}
              className="btn-icon btn-icon--orange"
            >
              <div className="btn-icon--icon">
                <GoComment />
              </div>
              <div className="btn-icon--number post-header__btn-number">
                {article.Comments ? article.Comments.length : 0}
              </div>
            </button>
          </div>
          <div className="post-header__btn">
            <button
              className={
                article.isLiked
                  ? "btn-icon btn-icon--active btn-icon--red"
                  : "btn-icon btn-icon--red"
              }
            >
              <div onClick={handleLike} className="btn-icon--icon">
                {article.isLiked ? <AiFillHeart /> : <AiOutlineHeart />}
              </div>
              <div className="btn-icon--number post-header__btn-number">
                {article.Likes ? article.Likes.length : 0}
              </div>
            </button>
          </div>
          <div className="post-header__btn">
            <button className="btn-icon btn-icon--primary">
              <div className="btn-icon--icon">
                <AiOutlineShareAlt />
              </div>
            </button>
          </div>
          <div className="post-header__btn">
            <button
              onClick={() => setIsOpened((prevState) => !prevState)}
              className="btn-icon btn-icon--green"
            >
              <div className="btn-icon--icon">
                {isOpened ? <AiOutlineMinusCircle /> : <AiOutlinePlusCircle />}
              </div>
            </button>
          </div>
        </div>
      </div>
      <div
        className={
          isOpened
            ? "post-content post-content--opened"
            : "post-content post-content--closed"
        }
      >
        <div
          dangerouslySetInnerHTML={{ __html: article.html }}
          className="post-content__content-box"
        ></div>
        {article.Subjects && article.Subjects.length > 0 && (
          <div className="post-content__categories-box">
            {article.Subjects.map((category, index) => {
              if (category.subject) {
                return (
                  <div key={index} className="post-content__category">
                    {category.subject}
                  </div>
                )
              } else return null
            })}
          </div>
        )}
        <div className="post-content__comments-box">
          <div className="post-content__comments-header">
            {article.Comments && article.Comments.length === 1
              ? "1 Comentário"
              : `${article.Comments.length} Comentários`}
          </div>
          <form
            onSubmit={handleComment}
            className="post-content__comments-input-box"
          >
            <input
              ref={commentInput}
              onChange={(e) => atMost200(e.target.value, setComment)}
              value={comment}
              placeholder="Comente aqui"
              className="post-content__comments-input"
            ></input>
          </form>
          <div className="post-content__comments">
            {article.Comments &&
              article.Comments.map((comment) => (
                <React.Fragment key={comment.id}>
                  <Comment
                    insertComment={insertComment}
                    comment={comment}
                    setError={setError}
                    setSuccess={setSuccess}
                    setPopupIn={setPopupIn}
                  />
                  {comment.replies &&
                    comment.replies.map((reply) => (
                      <Comment
                        key={reply.id}
                        insertComment={insertComment}
                        comment={reply}
                        setError={setError}
                        setSuccess={setSuccess}
                        setPopupIn={setPopupIn}
                      />
                    ))}
                </React.Fragment>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
