import React, { useState, useContext } from "react"
import { CSSTransition } from "react-transition-group"
import { FaTimes, FaCheck } from "react-icons/all"
import SadDrake from "../../assets/sad-drake.png"
import HappyDrake from "../../assets/happy-drake.png"
import api from "../../services/api"
import { verifyIfBlank } from "../../validators/general"
import { validateEmail } from "../../validators/email"
import ControlledInput from "../controlledInput"
import { CsrfContext } from "../context"
import UseAnimation from "react-useanimations"
import loading from "react-useanimations/lib/loading"

export default function LikeModal({
  modalIn,
  setModalIn,
  articleId,
  setError,
  setSuccess,
  setPopupIn,
  insertLike,
}) {
  const [name, setName] = useState("")
  const [errorName, setErrorName] = useState(null)

  const [email, setEmail] = useState("")
  const [errorEmail, setErrorEmail] = useState(null)

  const [loadingLike, setLoadingLike] = useState(false)

  const [isSubscriber, setIsSubscriber] = useState(false)

  const { csrfToken } = useContext(CsrfContext)

  async function handleSubmit(e) {
    e.preventDefault()

    const data = {
      name: verifyIfBlank(name, setErrorName),
      email: validateEmail(email, setErrorEmail),
      articleId,
    }

    if (data.name && data.email && data.articleId) {
      try {
        setLoadingLike(true)
        localStorage.setItem("name", data.name)
        localStorage.setItem("email", data.email)

        if (isSubscriber) {
          await api.post(
            "/subscribe",
            { name: data.name, email: data.email },
            {
              headers: {
                csrftoken: csrfToken,
              },
            }
          )
        }

        const response = await api.post("/like", data, {
          headers: {
            csrftoken: csrfToken,
          },
        })

        const createdLike = response.data.like

        setSuccess(true)
        setError(false)
        setName("")
        setEmail("")
        insertLike(createdLike)
      } catch (e) {
        if (
          e.response &&
          e.response.data &&
          e.response.data.error === "You are already a subscriber!"
        ) {
          setError("Você já está inscrito na nossa newsletter!")
        } else {
          setError("Algum erro aconteceu!")
        }
        setSuccess(false)
      } finally {
        setModalIn(false)
        setPopupIn(true)
        setLoadingLike(false)
      }
    }
  }

  return (
    <CSSTransition in={modalIn} timeout={500} classNames="modal" unmountOnExit>
      <div className="modal">
        <div
          onClick={() => {
            setModalIn((prevstate) => !prevstate)
          }}
          className="modal__close-area"
        ></div>
        <CSSTransition
          in={modalIn}
          timeout={500}
          classNames="modal__box"
          appear
        >
          <div className="modal__box modal__box">
            <button
              onClick={() => {
                setModalIn((prevstate) => !prevstate)
              }}
              className="modal__close-btn"
            >
              <FaTimes />
            </button>
            <div className="modal__content modal__content--fit-content-medium">
              <div className="post-comment-modal">
                <div className="post-comment-modal__img">
                  <img
                    src={isSubscriber ? HappyDrake : SadDrake}
                    alt="Sad Drake"
                  />
                </div>
                <form
                  onSubmit={handleSubmit}
                  className="post-comment-modal__content"
                >
                  <div className="post-comment-modal__heading">Curta posts</div>
                  <div className="post-comment-modal__input-box">
                    <ControlledInput
                      type="text"
                      placeholder="Nome"
                      state={name}
                      setState={setName}
                      error={errorName}
                    />
                  </div>
                  <div className="post-comment-modal__input-box">
                    <ControlledInput
                      type="text"
                      placeholder="Email"
                      state={email}
                      setState={setEmail}
                      error={errorEmail}
                    />
                  </div>
                  <div className="post-comment-modal__checkbox-group">
                    <input
                      onChange={() =>
                        setIsSubscriber((prevstate) => !prevstate)
                      }
                      id="subscribe-btn"
                      className="post-comment-modal__checkbox-input"
                      type="checkbox"
                    />
                    <label
                      htmlFor="subscribe-btn"
                      className={
                        isSubscriber
                          ? "post-comment-modal__checkbox-btn post-comment-modal__checkbox-btn--checked"
                          : "post-comment-modal__checkbox-btn"
                      }
                    >
                      {isSubscriber ? <FaCheck /> : null}
                    </label>
                    <p className="post-comment-modal__checkbox-text">
                      Quero receber novidades e ofertas para aprender novas
                      línguas através de memes.
                    </p>
                  </div>
                  <div className="post-comment-modal__submit-btn">
                    <button
                      type="submit"
                      className={
                        !loadingLike
                          ? "post-comment-modal__submit-btn btn-primary--thin btn-primary btn-primary--color-primary"
                          : "post-comment-modal__submit-btn btn-primary--thin btn-primary btn-primary--color-primary u-disabled-btn"
                      }
                    >
                      <div className="btn-primary--text">Ok</div>
                      {loadingLike ? (
                        <UseAnimation
                          wrapperStyle={{ width: "2rem", height: "2rem" }}
                          animation={loading}
                          strokeColor="#ffffff"
                        />
                      ) : null}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </CSSTransition>
      </div>
    </CSSTransition>
  )
}
