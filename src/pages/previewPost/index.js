import React, { useEffect, useState, useContext } from "react"
import scrollToTop from "../../components/scrollToTop"
import { AiOutlineHeart, AiOutlineShareAlt, GoComment } from "react-icons/all"
import LoadingContent from "../../components/loadingContent"
import PopupMessage from "../../components/popupMessage"
import getTimePassed from "../../utils/getTimePassed"
import api from "../../services/api"
import { UserContext } from "../../components/context"

function PreviewPost(props) {
  const [loadingContent, setLoadingContent] = useState(true)
  const [error, setError] = useState(null)
  const [post, setPost] = useState(null)
  const [categories, setCategories] = useState([])
  const [popupIn, setPopupIn] = useState(false)

  const { user } = useContext(UserContext)

  useEffect(() => {
    if (props.match.params.id) {
      if (user && user.isAdmin) {
        api
          .get(`/any/article/${props.match.params.id}`, {
            withCredentials: true,
          })
          .then((response) => {
            const article = response.data.article

            if (article) {
              setPost(article)

              const subjects = article.Subjects

              if (subjects) {
                subjects.map((subject) => {
                  setCategories((prevstate) => [...prevstate, subject.subject])
                  return null
                })
              }
            }
          })
          .catch((e) => {
            if (
              e.response &&
              e.response.data &&
              e.response.data.error === "No article found with this id!"
            ) {
              setError("Esse post não existe!")
            } else {
              setError("Algum erro aconteceu!")
            }
            setPopupIn(true)
            setPost(null)
            setCategories([])
          })
          .finally(() => setLoadingContent(false))
      } else {
        api
          .get(`/editor/article/${props.match.params.id}`, {
            withCredentials: true,
          })
          .then((response) => {
            const article = response.data.article

            if (article) {
              setPost(article)

              const subjects = article.Subjects

              if (subjects) {
                subjects.map((subject) => {
                  setCategories((prevstate) => [...prevstate, subject.subject])
                  return null
                })
              }
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
            setCategories([])
          })
          .finally(() => setLoadingContent(false))
      }
    }
  }, [props.match.params.id, user])

  function convertTime(timestamp) {
    const time = getTimePassed(timestamp)

    if (!time) {
      return "Data não encontrada!"
    } else {
      return `${time.n}${time.unit}`
    }
  }

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
        <div className="post-preview">
          <div className="post-box">
            <div className="post-header">
              <div className="post-header__header">
                <div className="post-header__profile-picture"></div>
                <div className="post-header__title">{post.title}</div>
                <div className="post-header__publish-time">
                  {convertTime(new Date(post.createdAt).getTime())}
                </div>
              </div>
              <div className="post-header__cover">
                <img src={post.cover} alt="Meme" />
              </div>
              <div className="post-header__btn-box">
                <div className="post-header__btn">
                  <button className="btn-icon btn-icon--orange u-discreet-disabled-btn">
                    <div className="btn-icon--icon">
                      <GoComment />
                    </div>
                  </button>
                </div>
                <div className="post-header__btn">
                  <button className="btn-icon btn-icon--red u-discreet-disabled-btn">
                    <div className="btn-icon--icon">
                      <AiOutlineHeart />
                    </div>
                  </button>
                </div>
                <div className="post-header__btn">
                  <button className="btn-icon btn-icon--primary u-discreet-disabled-btn">
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
              {categories ? (
                <div className="post-content__categories-box">
                  {categories.map((category, index) => (
                    <div key={index} className="post-content__category">
                      {category}
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}

export default scrollToTop({ component: PreviewPost })
