import React, { useState, useEffect } from "react"
import DashboardPost from "../../components/dashboardPost"
import scrollToTop from "../../components/scrollToTop"
import LoadingContent from "../../components/loadingContent"
import api from "../../services/api"
import PopupMessage from "../../components/popupMessage"

function Posts() {
  const [loadingContent, setLoadingContent] = useState(true)
  const [articles, setArticles] = useState([])

  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const [popupIn, setPopupIn] = useState(false)

  const [filter, setFilter] = useState("published")

  useEffect(() => {
    api
      .get("/editor/articles", { withCredentials: true })
      .then((response) => {
        const articles = response.data.articles

        setArticles(articles)

        setLoadingContent(false)
      })
      .catch((e) => {
        setError("Algo de errado aconteceu!")
        setPopupIn(true)
        setLoadingContent(false)
      })
  }, [])

  function removeArticle(id) {
    setArticles((prevstate) => prevstate.filter((entry) => entry.id !== id))
  }

  function togglePublishArticle(id) {
    setArticles((prevstate) =>
      prevstate.map((entry) => {
        if (entry.id === id) {
          return {
            ...entry,
            isPublished: !entry.isPublished,
          }
        } else {
          return entry
        }
      })
    )
  }

  function getPosts() {
    const published = articles.filter((article) => !!article.isPublished)
    const unpublished = articles.filter((article) => !article.isPublished)

    if (filter === "published") {
      if (published.length === 0) {
        return (
          <div className="dashboard__item u-no-transitions dashboard__item--warning u-discreet-disabled-btn">
            Nenhum post publicado!
          </div>
        )
      } else {
        return published.map((article) => {
          return (
            <DashboardPost
              key={article.id}
              article={article}
              remove={removeArticle}
              togglePublish={togglePublishArticle}
              setError={setError}
              setSuccess={setSuccess}
              setPopupIn={setPopupIn}
            />
          )
        })
      }
    } else if (filter === "unpublished") {
      if (unpublished.length === 0) {
        return (
          <div className="dashboard__item u-no-transitions dashboard__item--warning u-discreet-disabled-btn">
            Nenhum rascunho!
          </div>
        )
      } else {
        return unpublished.map((article) => {
          return (
            <DashboardPost
              key={article.id}
              article={article}
              remove={removeArticle}
              togglePublish={togglePublishArticle}
              setError={setError}
              setSuccess={setSuccess}
              setPopupIn={setPopupIn}
            />
          )
        })
      }
    } else {
      return null
    }
  }

  return (
    <>
      <PopupMessage
        modalIn={popupIn}
        setModalIn={setPopupIn}
        error={error}
        setError={setError}
        sucess={success}
        setSuccess={setSuccess}
      />
      <LoadingContent loadingIn={loadingContent} />
      {!loadingContent ? (
        <div className="dashboard dashboard--header">
          <div className="dashboard__header">
            <button
              onClick={() => setFilter("published")}
              className={
                filter === "published"
                  ? "dashboard__header-option dashboard__header-option--active"
                  : "dashboard__header-option"
              }
            >
              Publicados
            </button>
            <button
              onClick={() => setFilter("unpublished")}
              className={
                filter === "unpublished"
                  ? "dashboard__header-option dashboard__header-option--active"
                  : "dashboard__header-option"
              }
            >
              Rascunhos
            </button>
            <button
              onClick={() => setFilter("suggestion")}
              className={
                filter === "suggestion"
                  ? "dashboard__header-option dashboard__header-option--active u-disabled-btn"
                  : "dashboard__header-option u-disabled-btn"
              }
            >
              Sugestões
            </button>
          </div>
          {getPosts()}
        </div>
      ) : null}
    </>
  )
}

export default scrollToTop({ component: Posts })
