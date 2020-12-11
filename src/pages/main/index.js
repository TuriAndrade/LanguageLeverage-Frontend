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
import { FiltersContext } from "../../components/context"
import axios from "axios"

function Main() {
  const [articles, setArticles] = useState([])
  const [loadingContent, setLoadingContent] = useState(true)
  const [error, setError] = useState(null)
  const [popupIn, setPopupIn] = useState(false)
  const [loadingMoreArticles, setLoadingMoreArticles] = useState(false)
  const [hasMoreArticles, setHasMoreArticles] = useState(false)
  const [offset, setOffset] = useState(0)
  const [removeCategoriesIn, setRemoveCategoriesIn] = useState([])

  const { filters, setFilters } = useContext(FiltersContext)

  useEffect(() => {
    setArticles([])
    setOffset(0)
    setLoadingContent(true)
    setRemoveCategoriesIn(filters.map(() => false))
  }, [filters])

  useEffect(() => {
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

        setArticles((prevstate) => [...prevstate, ...articles])
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
  }, [offset, filters])

  const observer = useRef()

  const lastArticle = useCallback(
    (node) => {
      if (loadingMoreArticles) return null

      if (observer.current) observer.current.disconnect()

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMoreArticles) {
          setOffset(articles.length)
          setLoadingMoreArticles(true)
        }
      })

      if (node) observer.current.observe(node)
    },
    [loadingMoreArticles, hasMoreArticles, articles]
  )

  function insertComment({ articleId, comment }) {
    setArticles((prevstate) => {
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
    setArticles((prevstate) =>
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

  function removeCategory(index) {
    setFilters((prevstate) => prevstate.filter((entry, i) => i !== index))
  }

  return (
    <>
      <PopupMessage
        modalIn={popupIn}
        setModalIn={setPopupIn}
        error={error}
        setError={setError}
      />
      <LoadingContent loadingIn={loadingContent} />
      {!loadingContent ? (
        <div className={filters.length > 0 ? "feed feed--filters" : "feed"}>
          {filters.length > 0 ? (
            <div className="feed__categories-container">
              {filters.map((filter, index) => (
                <div
                  onClick={() =>
                    setRemoveCategoriesIn((prevstate) =>
                      prevstate.map((entry, i) => {
                        if (index !== i) return entry
                        else return true
                      })
                    )
                  }
                  key={index}
                  className="feed__category"
                >
                  <CSSTransition
                    in={removeCategoriesIn[index]}
                    timeout={800}
                    classNames="feed__active-category"
                    onEntered={() => removeCategory(index)}
                    unmountOnExit
                  >
                    <div className="feed__active-category">
                      <FaTimes />
                    </div>
                  </CSSTransition>
                  {filter}
                </div>
              ))}
            </div>
          ) : null}
          {articles.map((article, index) => {
            return index === articles.length - 1 ? (
              <Post
                fowardedRef={lastArticle}
                key={article.id}
                article={article}
                insertComment={insertComment}
                insertLike={insertLike}
              />
            ) : (
              <Post
                key={article.id}
                article={article}
                insertComment={insertComment}
                insertLike={insertLike}
              />
            )
          })}
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
          {!hasMoreArticles && articles.length > 0 && (
            <div className="post-box post-box--thats-it">
              <div className="post-box__icon post-box__icon--primary">
                <GoVerified />
              </div>
              <div className="post-box__text post-box__text--primary">
                Isso é tudo!
              </div>
            </div>
          )}
          {articles.length === 0 && (
            <div className="no-content">
              <div className="no-content__icon no-content__icon--red">
                <FaTimesCircle />
              </div>
              <div className="no-content__text no-content__text--red">
                Nada publicado!
              </div>
            </div>
          )}
        </div>
      ) : null}
    </>
  )
}

export default scrollToTop({ component: Main })
