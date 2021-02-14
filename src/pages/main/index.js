import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useContext,
} from "react"
import Post from "../../components/post"
import scrollToTop from "../../components/scrollToTop"
import LoadingContent from "../../components/loadingContent"
import PopupMessage from "../../components/popupMessage"
import api from "../../services/api"
import { CSSTransition } from "react-transition-group"
import UseAnimation from "react-useanimations"
import loading from "react-useanimations/lib/loading"
import { GoVerified, FaTimesCircle, FaTimes } from "react-icons/all"
import axios from "axios"
import { FiltersContext, FeedContext } from "../../components/context"
import { isEqual } from "lodash"

function Main() {
  const [loadingContent, setLoadingContent] = useState(true)
  const [error, setError] = useState(null)
  const [popupIn, setPopupIn] = useState(false)
  const [loadingMoreArticles, setLoadingMoreArticles] = useState(false)
  const [hasMoreArticles, setHasMoreArticles] = useState(false)
  const [offset, setOffset] = useState(0)
  const [isMount, setIsMount] = useState(true)

  const { filters, setFilters, prevFilters } = useContext(FiltersContext)
  const { basePosts, setBasePosts, currentPosts, setCurrentPosts } = useContext(
    FeedContext
  )

  useEffect(() => {
    if (!isEqual(filters, prevFilters)) {
      setCurrentPosts([])
      setOffset(0)
      setLoadingContent(true)
    }
  }, [filters, prevFilters, setCurrentPosts])

  useEffect(() => {
    if (isMount) {
      setIsMount(false)
      if (basePosts.length > 0 && filters.length === 0) {
        setCurrentPosts(basePosts)
        setLoadingContent(false)
        setLoadingMoreArticles(false)
        setHasMoreArticles(true)
      } else if (basePosts.length === 0 && filters.length === 0) {
        let cancel
        api
          .post(
            "get/feed",
            {
              offset,
              subjects: filters,
              email: localStorage.getItem("email") || undefined,
            },
            {
              withCredentials: true,
              cancelToken: new axios.CancelToken((c) => (cancel = c)),
            }
          )
          .then((response) => {
            const articles = response.data.articles

            setBasePosts(articles)
            setCurrentPosts(articles)
            setHasMoreArticles(articles.length > 0)
            setLoadingContent(false)
            setLoadingMoreArticles(false)
          })
          .catch((e) => {
            if (axios.isCancel(e)) return null
            setError("Algo de errado aconteceu!")
            setLoadingContent(false)
            setLoadingMoreArticles(false)
          })

        // I can't use finally here because, in case of a cancel error, I don't wanna set the loadings to false
        return () => cancel()
      } else if (filters.length > 0 && currentPosts.length === 0) {
        let cancel
        api
          .post(
            "get/feed",
            {
              offset,
              subjects: filters,
              email: localStorage.getItem("email") || undefined,
            },
            {
              withCredentials: true,
              cancelToken: new axios.CancelToken((c) => (cancel = c)),
            }
          )
          .then((response) => {
            const articles = response.data.articles

            setCurrentPosts(articles)
            setHasMoreArticles(articles.length > 0)
            setLoadingContent(false)
            setLoadingMoreArticles(false)
          })
          .catch((e) => {
            if (axios.isCancel(e)) return null
            setError("Algo de errado aconteceu!")
            setLoadingContent(false)
            setLoadingMoreArticles(false)
          })

        return () => cancel()
      } else {
        setLoadingContent(false)
        setLoadingMoreArticles(false)
        setHasMoreArticles(true)
      }
    } else {
      if (
        currentPosts.length === 0 &&
        filters.length === 0 &&
        basePosts.length > 0
      ) {
        setCurrentPosts(basePosts)
        setLoadingContent(false)
        setLoadingMoreArticles(false)
        setHasMoreArticles(true)
      } else if (offset >= currentPosts.length) {
        let cancel
        api
          .post(
            "get/feed",
            {
              offset,
              subjects: filters,
              email: localStorage.getItem("email") || undefined,
            },
            {
              withCredentials: true,
              cancelToken: new axios.CancelToken((c) => (cancel = c)),
            }
          )
          .then((response) => {
            const articles = response.data.articles

            if (filters.length === 0 && offset >= basePosts.length) {
              setBasePosts((prevstate) => [...prevstate, ...articles])
            }

            setCurrentPosts((prevstate) => [...prevstate, ...articles])
            setHasMoreArticles(articles.length > 0)
            setLoadingContent(false)
            setLoadingMoreArticles(false)
          })
          .catch((e) => {
            if (axios.isCancel(e)) return null
            setError("Algo de errado aconteceu!")
            setLoadingContent(false)
            setLoadingMoreArticles(false)
          })

        return () => cancel()
      }
    }
  }, [
    offset,
    filters,
    basePosts,
    setBasePosts,
    currentPosts.length,
    setCurrentPosts,
    isMount,
  ])

  const observer = useRef()

  const lastArticle = useCallback(
    (node) => {
      if (loadingMoreArticles) return null

      if (observer.current) observer.current.disconnect()

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMoreArticles) {
          setOffset(currentPosts.length)
          setLoadingMoreArticles(true)
        }
      })

      if (node) observer.current.observe(node)
    },
    [loadingMoreArticles, hasMoreArticles, currentPosts]
  )

  function insertComment({ articleId, comment }) {
    setCurrentPosts((prevstate) => {
      return prevstate.map((article) => {
        if (articleId === article.id) {
          return {
            ...article,
            Comments: !comment.replyTo
              ? [...article.Comments, comment]
              : article.Comments.map((entry) => {
                  if (entry.id === comment.replyTo) {
                    return {
                      ...entry,
                      replies: entry.replies
                        ? [...entry.replies, comment]
                        : [comment],
                    }
                  } else return entry
                }),
          }
        } else return article
      })
    })
  }

  function insertLike({ articleId, like }) {
    setCurrentPosts((prevstate) =>
      prevstate.map((article) => {
        if (articleId === article.id) {
          return {
            ...article,
            Likes: [...article.Likes, like],
            isLiked: true,
          }
        } else return article
      })
    )
  }

  function removeLike({ articleId, likeId }) {
    setCurrentPosts((prevstate) =>
      prevstate.map((article) => {
        if (articleId === article.id) {
          return {
            ...article,
            Likes: article.Likes.filter((like) => like.id !== likeId),
            isLiked: false,
          }
        } else return article
      })
    )
  }

  return (
    <>
      <PopupMessage
        modalIn={popupIn}
        setModalIn={setPopupIn}
        error={error}
        setError={setError}
      />
      <div className={filters.length > 0 ? "feed feed--filters" : "feed"}>
        <LoadingContent loadingIn={loadingContent} />
        {filters.length > 0 ? (
          <div className="filters__container">
            {filters.map((filter, index) => (
              <div key={index} className="filters__category">
                <button
                  onClick={() =>
                    setFilters((prevstate) =>
                      prevstate.filter((entry, i) => i !== index)
                    )
                  }
                  className="filters__remove-category-btn"
                >
                  <FaTimes />
                </button>
                {filter}
              </div>
            ))}
          </div>
        ) : null}
        {!loadingContent ? (
          <>
            {currentPosts.map((article, index) => {
              return (
                <Post
                  fowardedRef={
                    index === currentPosts.length - 1 ? lastArticle : undefined
                  }
                  key={article.id}
                  article={article}
                  insertComment={insertComment}
                  insertLike={insertLike}
                  removeLike={removeLike}
                />
              )
            })}
            {!hasMoreArticles && currentPosts.length > 0 ? (
              <div className="post-box post-box--thats-it">
                <div className="post-box__icon post-box__icon--primary">
                  <GoVerified />
                </div>
                <div className="post-box__text post-box__text--primary">
                  Isso é tudo!
                </div>
              </div>
            ) : currentPosts.length > 0 ? (
              <CSSTransition
                in={loadingMoreArticles}
                timeout={300}
                classNames="feed__loading"
                unmountOnExit
              >
                <div className="feed__loading">
                  <UseAnimation
                    wrapperStyle={{ width: "4rem", height: "4rem" }}
                    animation={loading}
                    strokeColor="#0092db"
                  />
                </div>
              </CSSTransition>
            ) : null}
            {currentPosts.length === 0 && (
              <div className="no-content">
                <div className="no-content__icon no-content__icon--red">
                  <FaTimesCircle />
                </div>
                <div className="no-content__text no-content__text--red">
                  Nada publicado!
                </div>
              </div>
            )}
          </>
        ) : null}
      </div>
    </>
  )
}

export default scrollToTop({ component: Main })
