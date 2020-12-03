import React, { useState, useEffect, useRef, useCallback } from "react"
import Post from "../../components/post"
import scrollToTop from "../../components/scrollToTop"
import LoadingContent from "../../components/loadingContent"
import PopupMessage from "../../components/popupMessage"
import api from "../../services/api"
import { CSSTransition } from "react-transition-group"
import UseAnimation from "react-useanimations"
import loading from "react-useanimations/lib/loading"

function Main() {
  const [articles, setArticles] = useState([])
  const [loadingContent, setLoadingContent] = useState(true)
  const [error, setError] = useState(null)
  const [popupIn, setPopupIn] = useState(false)
  const [loadingMoreArticles, setLoadingMoreArticles] = useState(false)
  const [hasMoreArticles, setHasMoreArticles] = useState(false)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    api
      .post("get/feed", { offset })
      .then((response) => {
        const articles = response.data.articles

        setArticles((prevstate) => [...prevstate, ...articles])
        setHasMoreArticles(articles.length > 0)
      })
      .catch((e) => {
        setError("Algo de errado aconteceu!")
      })
      .finally(() => {
        setLoadingContent(false)
        setLoadingMoreArticles(false)
      })
  }, [offset])

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
        <div className="feed">
          {articles.map((article, index) => {
            return index === articles.length - 1 ? (
              <Post
                fowardedRef={lastArticle}
                key={article.id}
                article={article}
              />
            ) : (
              <Post key={article.id} article={article} />
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
        </div>
      ) : null}
    </>
  )
}

export default scrollToTop({ component: Main })
