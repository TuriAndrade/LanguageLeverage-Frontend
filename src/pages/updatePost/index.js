import React, { useEffect, useState } from "react"
import scrollToTop from "../../components/scrollToTop"
import EditPost from "../../components/editPost"
import api from "../../services/api"
import PopupMessage from "../../components/popupMessage"
import LoadingContent from "../../components/loadingContent"

function UpdatePost(props) {
  const [post, setPost] = useState(null)
  const [categories, setCategories] = useState(null)
  const [loadingContent, setLoadingContent] = useState(true)
  const [error, setError] = useState(null)
  const [popupIn, setPopupIn] = useState(false)

  useEffect(() => {
    if (props.match.params.id) {
      api
        .get(`/editor/article/${props.match.params.id}`, {
          withCredentials: true,
        })
        .then((response) => {
          const article = response.data.article

          if (article) {
            setPost(article)
          }

          const subjects = response.data.subjects

          if (subjects) {
            subjects.map((subject) => {
              setCategories((prevstate) => {
                if (prevstate) {
                  return [...prevstate, subject.subject]
                } else {
                  return [subject.subject]
                }
              })
              return null
            })
          }
        })
        .catch((e) => {
          if (
            e.response &&
            e.response.data &&
            e.response.data.error ===
              "No article found with this id and editor id!"
          ) {
            setError("Esse post não pertence a você ou não existe!")
          } else {
            setError("Algum erro aconteceu!")
          }
          setPopupIn(true)
          setPost(null)
          setCategories(null)
        })
        .finally(() => setLoadingContent(false))
    } else {
      setLoadingContent(false)
    }
  }, [props.match.params.id])

  return (
    <>
      <PopupMessage
        error={error}
        setError={setError}
        modalIn={popupIn}
        setModalIn={setPopupIn}
      />
      <LoadingContent loadingIn={loadingContent} />
      {!loadingContent && post ? (
        <EditPost post={post} categories={categories} />
      ) : null}
    </>
  )
}

export default scrollToTop({ component: UpdatePost })
