import React, {
  useState,
  useContext,
  useRef,
  useEffect,
  useLayoutEffect,
} from "react"
import Comment from "../../components/comment"
import { CsrfContext, UserContext } from "../../components/context"
import { CSSTransition } from "react-transition-group"
import CommentModal from "../../components/commentModal"
import LikeModal from "../../components/likeModal"
import {
  AiOutlineHeart,
  AiFillHeart,
  AiOutlineShareAlt,
  GoComment,
  AiOutlinePlusCircle,
} from "react-icons/all"
import getTimePassed from "../../utils/getTimePassed"
import DefaultProfilePicture from "../../assets/default-profile-picture.png"
import { atMost200 } from "../../validators/general"
import api from "../../services/api"
import axios from "axios"
import UseAnimation from "react-useanimations"
import loading from "react-useanimations/lib/loading"
import Image from "../../components/image"
import LoadingContent from "../../components/loadingContent"
import PopupMessage from "../../components/popupMessage"

export default function Post(props) {
  const [article, setArticle] = useState(null)
  const [loadingContent, setLoadingContent] = useState(true)

  const [comment, setComment] = useState("")
  const [nComments, setNComments] = useState(null)
  const [loadingComment, setLoadingComment] = useState(false)

  const [like, setLike] = useState(null)
  const [nLikes, setNLikes] = useState(null)

  const [commentIn, setCommentIn] = useState(false)
  const [likeIn, setLikeIn] = useState(false)
  const [popupIn, setPopupIn] = useState(false)

  const [commentsArray, setCommentsArray] = useState([])
  const [commentsOffset, setCommentsOffset] = useState(0)
  const [fetchingComments, setFetchingComments] = useState(false)
  const [hasMoreComments, setHasMoreComments] = useState(false)

  const [categories, setCategories] = useState([])

  const [message, setMessage] = useState(null)
  const [messageIn, setMessageIn] = useState(false)

  const [scrollToComments, setScrollToComments] = useState(false)

  const [error, setError] = useState(null)

  const [success, setSuccess] = useState(null)

  const { csrfToken } = useContext(CsrfContext)
  const { user } = useContext(UserContext)

  const commentInput = useRef()

  const cancelLike = useRef(null)

  useEffect(() => {
    if (props.match.params.id) {
      setFetchingComments(true)

      Promise.all([
        api
          .get(`/published/article/${props.match.params.id}`)
          .then((response) => {
            setArticle(response.data.article)
          }),

        api
          .get(`/comments/number/${props.match.params.id}`)
          .then((response) => {
            setNComments(response.data.nComments)
          }),

        api
          .get(`/article/subjects/${props.match.params.id}`)
          .then((response) => {
            setCategories(response.data.subjects)
          }),

        api
          .post(
            `/get/likes/${props.match.params.id}`,
            {
              email: localStorage.getItem("email") || undefined,
            },
            { withCredentials: true }
          )
          .then((response) => {
            setNLikes(response.data.nLikes)
            setLike(response.data.isLiked)
          }),

        api
          .post(`/get/comments/${props.match.params.id}`, {
            offset: 0,
          })
          .then((response) => {
            setCommentsArray(
              response.data.comments.map((comment) => ({
                ...comment,
                fetchingReplies: false,
                repliesOffset: 0,
              }))
            )
            setFetchingComments(false)
            setHasMoreComments(response.data.hasMore)
          }),
      ])
        .catch((e) => {
          if (
            e.response &&
            e.response.data.error === "No published article found with this id!"
          ) {
            setError("Artigo não encontrado!")
            setPopupIn(true)
          }
        })
        .finally(() => setLoadingContent(false))
    }
  }, [props.match.params.id])

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

  useLayoutEffect(() => {
    //useLayoutEffect to avoid flashing when hasMore btn changes to loading gif
    if (commentsOffset > 0) {
      setFetchingComments(true)
      api
        .post(`/get/comments/${props.match.params.id}`, {
          offset: commentsOffset,
        })
        .then((response) => {
          setCommentsArray((prevstate) => [
            ...prevstate,
            ...response.data.comments.map((comment) => ({
              ...comment,
              fetchingReplies: false,
              repliesOffset: 0,
            })),
          ])
          setFetchingComments(false)
          setHasMoreComments(response.data.hasMore)
        })
    }
  }, [props.match.params.id, commentsOffset])

  useEffect(() => {
    commentsArray.map((comment, index) => {
      if (comment.fetchingReplies) {
        api
          .post(`/get/replies/${comment.id}`, {
            offset: comment.repliesOffset,
          })
          .then((response) => {
            setCommentsArray((prevstate) =>
              prevstate.map((entry, i) =>
                i === index
                  ? {
                      ...entry,
                      replies: [...entry.replies, ...response.data.replies],
                      fetchingReplies: false,
                      hasMoreReplies: response.data.hasMore,
                    }
                  : entry
              )
            )
          })
      }

      return null
    })
  }, [commentsArray])

  function convertTime(timestamp) {
    const time = getTimePassed(timestamp)

    if (!time) {
      return "Data não encontrada!"
    } else {
      return `${time.n}${time.unit}`
    }
  }

  function insertComment(comment) {
    setCommentsArray((prevstate) => {
      if (comment.replyTo) {
        return prevstate.map((entry) => {
          if (entry.id === comment.replyTo) {
            return {
              ...entry,
              replies: entry.replies ? [comment, ...entry.replies] : [comment],
            }
          } else return entry
        })
      } else return [comment, ...prevstate]
    })
    setNComments((prevstate) => prevstate + 1)
  }

  function toggleLike() {
    if (!like) {
      setLike(true)
      setNLikes((prevstate) => prevstate + 1)
    } else {
      setLike(false)
      setNLikes((prevstate) => prevstate - 1)
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
          toggleLike()
          await api.post(
            "/like",
            {
              email: localStorage.getItem("email") || undefined,
              articleId: article.id,
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
        } catch (e) {
          return
        }
      } else {
        setLikeIn(true)
      }
    } else {
      try {
        toggleLike()
        await api.post(
          "/dislike",
          {
            email: localStorage.getItem("email") || undefined,
            articleId: article.id,
          },
          {
            withCredentials: true,
            cancelToken: new axios.CancelToken((c) => (cancelLike.current = c)),
            headers: {
              csrftoken: csrfToken,
            },
          }
        )
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

          insertComment(createdComment)
          setComment("")
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
      .writeText(`${process.env.REACT_APP_URL}/post/${article.id}`)
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

  return (
    <>
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
      <PopupMessage
        modalIn={popupIn}
        setModalIn={setPopupIn}
        error={error}
        setError={setError}
        sucess={success}
        setSuccess={setSuccess}
        disappear={!!article}
      />
      <LoadingContent loadingIn={loadingContent} />
      {!loadingContent && article && (
        <div className="post-preview">
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
            insertLike={toggleLike}
          />
          <div className="post-box">
            <div className="post-header">
              <div className="post-header__header">
                <Image
                  src={article.Editor.User.picture || DefaultProfilePicture}
                  alt="EditorPic"
                  containerClass="post-header__profile-picture"
                />
                <div className="post-header__login">
                  <div className="post-header__login--text">
                    {article.Editor.User.login}
                  </div>
                </div>
                <div className="post-header__publish-time">
                  {convertTime(new Date(article.createdAt).getTime())}
                </div>
              </div>
              <Image
                containerClass="post-header__cover"
                src={article.cover}
                alt="Capa"
                withPlaceholder
                placeholderClass="post-header__cover--placeholder"
              />
              <div className="post-header__btn-box">
                <div className="post-header__btn">
                  <button
                    onClick={() => {
                      setScrollToComments(true)
                    }}
                    className={
                      nComments !== null
                        ? "btn-icon btn-icon--orange"
                        : "btn-icon btn-icon--orange u-disabled-btn"
                    }
                  >
                    <div className="btn-icon--icon">
                      <GoComment />
                    </div>
                    <div className="btn-icon--number post-header__btn-number">
                      {nComments}
                    </div>
                  </button>
                </div>
                <div className="post-header__btn">
                  <button
                    className={
                      like === true
                        ? "btn-icon btn-icon--active btn-icon--red"
                        : like === false
                        ? "btn-icon btn-icon--red"
                        : "btn-icon btn-icon--red u-disabled-btn"
                    }
                  >
                    <div onClick={handleLike} className="btn-icon--icon">
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
                dangerouslySetInnerHTML={{ __html: article.html }}
                className="post-content__content-box"
              ></div>
              {categories.length > 0 && (
                <div className="post-content__categories-box">
                  {categories.map((category, index) => {
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
                  {nComments === 1
                    ? "1 Comentário"
                    : `${nComments} Comentários`}
                </div>
                <form
                  onSubmit={handleComment}
                  className="post-comment__input-box"
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
                  {commentsArray.map((comment, index) => (
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
                      {comment.hasMoreReplies ? (
                        <button
                          onClick={() => {
                            setCommentsArray((prevstate) =>
                              prevstate.map((entry, i) =>
                                i === index
                                  ? {
                                      ...entry,
                                      repliesOffset: comment.replies.length,
                                      fetchingReplies: true,
                                    }
                                  : entry
                              )
                            )
                          }}
                          className="post-content__has-more-replies"
                        >
                          {comment.fetchingReplies ? (
                            <UseAnimation
                              wrapperStyle={{ width: "3rem", height: "3rem" }}
                              animation={loading}
                              strokeColor="#0092db"
                            />
                          ) : (
                            "Mais"
                          )}
                        </button>
                      ) : null}
                    </React.Fragment>
                  ))}
                  {fetchingComments ? (
                    <div className="post-content__fetching-comments">
                      <UseAnimation
                        wrapperStyle={{ width: "4rem", height: "4rem" }}
                        animation={loading}
                        strokeColor="#0092db"
                      />
                    </div>
                  ) : null}
                  {hasMoreComments ? (
                    <button
                      onClick={() => {
                        setCommentsOffset(commentsArray.length)
                        setHasMoreComments(false)
                      }}
                      className="post-content__has-more-comments"
                    >
                      <AiOutlinePlusCircle />
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
