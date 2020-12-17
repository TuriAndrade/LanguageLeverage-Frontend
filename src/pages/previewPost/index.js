import React, { useEffect, useState, useContext } from "react"
import scrollToTop from "../../components/scrollToTop"
import { AiOutlineHeart, AiOutlineShareAlt, GoComment } from "react-icons/all"
import LoadingContent from "../../components/loadingContent"
import PopupMessage from "../../components/popupMessage"
import getTimePassed from "../../utils/getTimePassed"
import api from "../../services/api"
import { UserContext } from "../../components/context"
import DefaultProfilePic from "../../assets/default-profile-picture.png"
import Img from "react-cool-img"

function PreviewPost(props) {
  const [loadingContent, setLoadingContent] = useState(true)
  const [error, setError] = useState(null)
  const [post, setPost] = useState(null)
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

            setPost(article)
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
          })
          .finally(() => setLoadingContent(false))
      } else {
        api
          .get(`/editor/article/${props.match.params.id}`, {
            withCredentials: true,
          })
          .then((response) => {
            const article = response.data.article

            setPost(article)
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
                <div className="post-header__profile-picture">
                  <Img
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
                <Img src={post.cover} alt="Meme" />
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
              {post.Subjects && post.Subjects.length > 0 ? (
                <div className="post-content__categories-box">
                  {post.Subjects.map((subject, index) => (
                    <div key={index} className="post-content__category">
                      {subject.subject}
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
