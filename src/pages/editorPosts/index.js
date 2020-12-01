import React, { useState, useEffect } from "react"
import AdminDashboardPost from "../../components/adminDashboardPost"
import scrollToTop from "../../components/scrollToTop"
import LoadingContent from "../../components/loadingContent"
import api from "../../services/api"
import PopupMessage from "../../components/popupMessage"

function EditorPosts(props) {
  const [loadingContent, setLoadingContent] = useState(true)
  const [articles, setArticles] = useState(null)

  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const [popupIn, setPopupIn] = useState(false)

  const [filter, setFilter] = useState("published")

  useEffect(() => {
    if (props.match.params.editorId) {
      api
        .get(`/editor/articles/${props.match.params.editorId}`, {
          withCredentials: true,
        })
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
    }
  }, [props.match.params.editorId])

  function removeArticle(id) {
    setArticles((prevstate) =>
      Array.isArray(prevstate)
        ? prevstate.filter((entry) => entry.id !== id)
        : prevstate
    )
  }

  function unpublishArticle(id) {
    setArticles((prevstate) =>
      Array.isArray(prevstate)
        ? prevstate.map((entry) => {
            if (entry.id === id) {
              return {
                ...entry,
                isPublished: false,
              }
            } else {
              return entry
            }
          })
        : prevstate
    )
  }

  function getPosts() {
    const published =
      Array.isArray(articles) &&
      articles.filter((article) => !!article.isPublished)
    const unpublished =
      Array.isArray(articles) &&
      articles.filter((article) => !article.isPublished)

    if (filter === "published") {
      if (!Array.isArray(published) || (published && published.length === 0)) {
        return (
          <div className="dashboard__item u-no-transitions dashboard__item--warning u-discreet-disabled-btn">
            Nenhum post publicado!
          </div>
        )
      } else {
        return published.map((article) => {
          return (
            <AdminDashboardPost
              key={article.id}
              article={article}
              remove={removeArticle}
              unpublish={unpublishArticle}
              setError={setError}
              setSuccess={setSuccess}
              setPopupIn={setPopupIn}
            />
          )
        })
      }
    } else if (filter === "unpublished") {
      if (
        !Array.isArray(unpublished) ||
        (unpublished && unpublished.length === 0)
      ) {
        return (
          <div className="dashboard__item u-no-transitions dashboard__item--warning u-discreet-disabled-btn">
            Nenhum rascunho!
          </div>
        )
      } else {
        return unpublished.map((article) => {
          return (
            <AdminDashboardPost
              key={article.id}
              article={article}
              remove={removeArticle}
              unpublish={unpublishArticle}
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
          </div>
          {getPosts()}
        </div>
      ) : null}
    </>
  )
}

export default scrollToTop({ component: EditorPosts })
