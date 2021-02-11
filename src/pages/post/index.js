import React, { useEffect, useState, useContext, useRef } from "react"
import scrollToTop from "../../components/scrollToTop"
import {
  AiOutlineHeart,
  AiOutlineShareAlt,
  GoComment,
  AiFillHeart,
} from "react-icons/all"
import LoadingContent from "../../components/loadingContent"
import PopupMessage from "../../components/popupMessage"
import getTimePassed from "../../utils/getTimePassed"
import api from "../../services/api"
import DefaultProfilePic from "../../assets/default-profile-picture.png"
import { UserContext, CsrfContext } from "../../components/context"
import { atMost200 } from "../../validators/general"
import Comment from "../../components/comment"
import CommentModal from "../../components/commentModal"
import LikeModal from "../../components/likeModal"
import { CSSTransition } from "react-transition-group"
import LazyImage from "../../components/lazyImage"
import "dotenv"
import axios from "axios"
import UseAnimation from "react-useanimations"
import loading from "react-useanimations/lib/loading"

function Post(props) {
  const [loadingContent, setLoadingContent] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [post, setPost] = useState(null)
  const [popupIn, setPopupIn] = useState(false)
  const [comment, setComment] = useState("")
  const [loadingComment, setLoadingComment] = useState(false)
  const [commentIn, setCommentIn] = useState(false)
  const [likeIn, setLikeIn] = useState(false)
  const [scrollToComments, setScrollToComments] = useState(false)
  const [message, setMessage] = useState(null)
  const [messageIn, setMessageIn] = useState(false)
  const [like, setLike] = useState(false)
  const [nLikes, setNLikes] = useState(0)

  const { user } = useContext(UserContext)
  const { csrfToken } = useContext(CsrfContext)

  const commentInput = useRef()

  const cancelLike = useRef(null)

  useEffect(() => {
    if (scrollToComments && commentInput && commentInput.current) {
      commentInput.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      })

      setScrollToComments(false)
    }
  }, [scrollToComments])

  useEffect(() => {
    if (props.match.params.id) {
      api
        .post(
          `get/published/article/${props.match.params.id}`,
          {
            email: localStorage.getItem("email") || undefined,
          },
          { withCredentials: true }
        )
        .then((response) => {
          const article = response.data.article

          setPost(article)

          setNLikes(article.Likes.length)

          if (article.isLiked) {
            setLike(true)
          }
        })
        .catch((e) => {
          if (
            e.response &&
            e.response.data &&
            e.response.data.error === "No published article found with this id!"
          ) {
            setError("Esse post não existe ou não está publicado!")
          } else {
            setError("Algum erro aconteceu!")
          }
          setPopupIn(true)
          setPost(null)
        })
        .finally(() => setLoadingContent(false))
    }
  }, [props.match.params.id])

  function convertTime(timestamp) {
    const time = getTimePassed(timestamp)

    if (!time) {
      return "Data não encontrada!"
    } else {
      return `${time.n}${time.unit}`
    }
  }

  async function handleLike() {
    cancelLike.current && cancelLike.current()

    if (!like) {
      if (
        (localStorage.getItem("name") && localStorage.getItem("email")) ||
        (user && !user.loading)
      ) {
        try {
          setLike(true)
          setNLikes((prevstate) => prevstate + 1)
          const response = await api.post(
            "/like",
            {
              email: localStorage.getItem("email") || undefined,
              articleId: post.id,
            },
            {
              withCredentials: true,
              cancelToken: new axios.CancelToken(
                (c) => (cancelLike.current = c)
              ),
              headers: {
                csrftoken: csrfToken,
              },
            }
          )

          const createdLike = response.data.like

          insertLike({ like: createdLike })
        } catch (e) {
          return
        }
      } else {
        setLikeIn(true)
      }
    } else {
      try {
        setLike(false)
        setNLikes((prevstate) => prevstate - 1)
        const response = await api.post(
          "/dislike",
          {
            email: localStorage.getItem("email") || undefined,
            articleId: post.id,
          },
          {
            withCredentials: true,
            cancelToken: new axios.CancelToken((c) => (cancelLike.current = c)),
            headers: {
              csrftoken: csrfToken,
            },
          }
        )

        const likeId = response.data.likeId

        removeLike({ likeId })
      } catch (e) {
        return
      }
    }
  }

  async function handleComment(e) {
    e.preventDefault()

    if (comment && !loadingComment) {
      if (
        (localStorage.getItem("name") && localStorage.getItem("email")) ||
        (user && !user.loading)
      ) {
        try {
          setLoadingComment(true)
          const response = await api.post(
            "/comment",
            {
              name: localStorage.getItem("name") || undefined,
              email: localStorage.getItem("email") || undefined,
              text: comment,
              articleId: post.id,
            },
            {
              withCredentials: true,
              headers: {
                csrftoken: csrfToken,
              },
            }
          )

          const createdComment = response.data.comment
          setComment("")
          insertComment({ comment: createdComment })
        } catch (e) {
          setError("Algum erro aconteceu!")
          setPopupIn(true)
        } finally {
          setLoadingComment(false)
        }
      } else {
        setCommentIn(true)
      }
    }
  }

  function copyToClipboard() {
    navigator.clipboard
      .writeText(`${process.env.REACT_APP_URL}/post/${post.id}`)
      .then(
        function () {
          setMessage("Link copiado!")
        },
        function () {
          setMessage("Falha ao copiar o link!")
        }
      )
      .finally(() => {
        setMessageIn(true)
      })
  }

  function insertComment({ comment }) {
    setPost((prevstate) => ({
      ...prevstate,
      Comments: !comment.replyTo
        ? [...prevstate.Comments, comment]
        : prevstate.Comments.map((entry) => {
            if (entry.id === comment.replyTo) {
              return {
                ...entry,
                replies: entry.replies
                  ? [...entry.replies, comment]
                  : [comment],
              }
            } else return entry
          }),
    }))
  }

  function insertLike({ like }) {
    setPost((prevstate) => ({
      ...prevstate,
      Likes: [...prevstate.Likes, like],
      isLiked: true,
    }))
  }

  function removeLike({ likeId }) {
    setPost((prevstate) => ({
      ...prevstate,
      Likes: prevstate.Likes.filter((like) => like.id !== likeId),
      isLiked: false,
    }))
  }

  return (
    <>
      <PopupMessage
        error={error}
        setError={setError}
        success={success}
        setSuccess={setSuccess}
        modalIn={popupIn}
        setModalIn={setPopupIn}
      />
      <CSSTransition
        in={messageIn}
        classNames="bottom-message"
        timeout={{ enter: 1200, exit: 400 }}
        onEntered={() => setMessageIn(false)}
        onExited={() => setMessage(null)}
        unmountOnExit
      >
        <div className="bottom-message">{message}</div>
      </CSSTransition>
      <LoadingContent loadingIn={loadingContent} />
      {!loadingContent && post ? (
        <div className="post-preview">
          <CommentModal
            modalIn={commentIn}
            setModalIn={setCommentIn}
            comment={comment}
            articleId={post.id}
            setError={setError}
            setSuccess={setSuccess}
            setPopupIn={setPopupIn}
            setComment={setComment}
            insertComment={insertComment}
          />
          <LikeModal
            modalIn={likeIn}
            setModalIn={setLikeIn}
            articleId={post.id}
            setError={setError}
            setSuccess={setSuccess}
            setPopupIn={setPopupIn}
            setComment={setComment}
            insertLike={insertLike}
          />
          <div className="post-box">
            <div className="post-header">
              <div className="post-header__header">
                <div className="post-header__profile-picture">
                  <LazyImage
                    src={
                      (post.Editor &&
                        post.Editor.User &&
                        post.Editor.User.picture) ||
                      DefaultProfilePic
                    }
                    alt="Profile pic"
                  />
                </div>
                <div className="post-header__login">
                  <div className="post-header__login--text">
                    {post.Editor && post.Editor.User && post.Editor.User.login}
                  </div>
                </div>
                <div className="post-header__publish-time">
                  {convertTime(new Date(post.createdAt).getTime())}
                </div>
              </div>
              <div className="post-header__cover">
                <LazyImage src={post.cover} alt="Meme" />
              </div>
              <div className="post-header__btn-box">
                <div className="post-header__btn">
                  <button
                    onClick={() => setScrollToComments(true)}
                    className="btn-icon btn-icon--orange"
                  >
                    <div className="btn-icon--icon">
                      <GoComment />
                    </div>
                    <div className="btn-icon--number post-header__btn-number">
                      {post.Comments ? post.Comments.length : 0}
                    </div>
                  </button>
                </div>
                <div className="post-header__btn">
                  <button
                    onClick={handleLike}
                    className={
                      like
                        ? "btn-icon btn-icon--active btn-icon--red"
                        : "btn-icon btn-icon--red"
                    }
                  >
                    <div className="btn-icon--icon">
                      {like ? <AiFillHeart /> : <AiOutlineHeart />}
                    </div>
                    <div className="btn-icon--number post-header__btn-number">
                      {nLikes}
                    </div>
                  </button>
                </div>
                <div className="post-header__btn">
                  <button
                    onClick={copyToClipboard}
                    className="btn-icon btn-icon--primary"
                  >
                    <div className="btn-icon--icon">
                      <AiOutlineShareAlt />
                    </div>
                  </button>
                </div>
              </div>
            </div>
            <div className="post-content post-content--opened">
              <div
                dangerouslySetInnerHTML={{ __html: post.html }}
                className="post-content__content-box"
              ></div>
              {post.Subjects && post.Subjects.length > 0 ? (
                <div className="post-content__categories-box">
                  {post.Subjects.map((subject, index) => (
                    <div key={index} className="post-content__category">
                      {subject.subject}
                    </div>
                  ))}
                </div>
              ) : null}
              <div className="post-content__comments-box">
                <div className="post-content__comments-header">
                  {post.Comments && post.Comments.length === 1
                    ? "1 Comentário"
                    : `${post.Comments.length} Comentários`}
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
                    className={
                      loadingComment
                        ? "post-content__comments-input post-content__comments-input--loading"
                        : "post-content__comments-input"
                    }
                  />
                  {loadingComment ? (
                    <div className="post-content__comments-loading">
                      <UseAnimation
                        wrapperStyle={{ width: "3rem", height: "3rem" }}
                        animation={loading}
                        strokeColor="#fff"
                      />
                    </div>
                  ) : null}
                </form>
                <div className="post-content__comments">
                  {post.Comments &&
                    post.Comments.map((comment) => (
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
        </div>
      ) : null}
    </>
  )
}

export default scrollToTop({ component: Post })
