import React, { useState, useContext, useEffect } from "react"
import { FiClock, FaTimes, RiSettingsLine } from "react-icons/all"
import { CSSTransition } from "react-transition-group"
import getTimePassed from "../../utils/getTimePassed"
import { Link } from "react-router-dom"
import api from "../../services/api"
import { CsrfContext } from "../context"
import UseAnimation from "react-useanimations"
import loading from "react-useanimations/lib/loading"
import { UserContext } from "../context"

export default function DashboardPost({
  article,
  remove,
  togglePublish,
  setError,
  setSuccess,
  setPopupIn,
}) {
  const [optionsIn, setOptionsIn] = useState(false)
  const [unpublishIn, setUnpublishIn] = useState(false)
  const [deleteIn, setDeleteIn] = useState(false)
  const [messageIn, setMessageIn] = useState(false)
  const [message, setMessage] = useState(null)
  const [waitingOnTogglePublish, setWaitingOnTogglePublish] = useState(false)
  const [waitingOnDelete, setWaitingOnDelete] = useState(false)
  const [waitingOnConfirmUnpublish, setWaitingOnConfirmUnpublish] = useState(
    false
  )
  const { csrfToken } = useContext(CsrfContext)
  const { user } = useContext(UserContext)

  useEffect(() => {
    if (messageIn) {
      const messageTimeout = setTimeout(() => setMessageIn(false), 2000)

      return () => clearTimeout(messageTimeout)
    }
  }, [messageIn])

  function convertTime(timestamp) {
    const time = getTimePassed(timestamp)

    if (!time) {
      return "Data não encontrada!"
    } else {
      return `${time.n}${time.unit}`
    }
  }

  async function handleTogglePublish(e) {
    e.preventDefault()

    if (article.isPublished) {
      try {
        setWaitingOnTogglePublish(true)

        await api.patch(
          `/unpublish/article/${article.id}`,
          {
            confirmation: false,
          },
          {
            withCredentials: true,
            headers: {
              csrftoken: csrfToken,
            },
          }
        )

        setSuccess(true)
        setError(null)
        setPopupIn(true)
        setOptionsIn(false)
        togglePublish(article.id)
      } catch (e) {
        if (
          e.response &&
          e.response.data &&
          e.response.data.error ===
            "No published article found with this id and editor id!"
        ) {
          setError("Artigo não encontrado!")
          setPopupIn(true)
        } else if (
          e.response &&
          e.response.data &&
          e.response.data.error === "Confirmation required!"
        ) {
          setUnpublishIn(true)
        } else {
          setError("Algo de errado aconteceu!")
          setPopupIn(true)
        }

        setSuccess(false)
        setOptionsIn(false)
        setWaitingOnTogglePublish(false) // no need for finally because this component is unmounted on success
      }
    } else {
      try {
        setWaitingOnTogglePublish(true)

        await api.patch(`/publish/article/${article.id}`, null, {
          withCredentials: true,
          headers: {
            csrftoken: csrfToken,
          },
        })

        setSuccess(true)
        setError(null)
        setPopupIn(true)
        setOptionsIn(false)
        togglePublish(article.id)
      } catch (e) {
        if (
          e.response &&
          e.response.data &&
          e.response.data.error ===
            "No unpublished article found with this id and editor id!"
        ) {
          setError("Artigo não encontrado!")
        } else if (
          e.response &&
          e.response.data &&
          e.response.data.error === "No validated editor found with this id!"
        ) {
          setError("Você não tem permissão para postar!")
        } else {
          setError("Algo de errado aconteceu!")
        }

        setPopupIn(true)
        setSuccess(false)
        setOptionsIn(false)
        setWaitingOnTogglePublish(false) // no need for finally because this component is unmounted on success
      }
    }
  }

  async function confirmUnpublish(e) {
    e.preventDefault()

    try {
      setWaitingOnConfirmUnpublish(true)

      await api.patch(
        `/unpublish/article/${article.id}`,
        {
          confirmation: true,
        },
        {
          withCredentials: true,
          headers: {
            csrftoken: csrfToken,
          },
        }
      )

      setSuccess(true)
      setError(null)
      setPopupIn(true)
      setUnpublishIn(false)
      togglePublish(article.id)
    } catch (e) {
      if (
        e.response &&
        e.response.data &&
        e.response.data.error ===
          "No published article found with this id and editor id!"
      ) {
        setError("Artigo não encontrado!")
      } else {
        setError("Algo de errado aconteceu!")
      }

      setPopupIn(true)
      setSuccess(false)
      setUnpublishIn(false)
      setWaitingOnConfirmUnpublish(false) // no need for finally because this component is unmounted on success
    }
  }

  async function handleDelete(e) {
    e.preventDefault()

    try {
      setWaitingOnDelete(true)

      await api.delete(`/article/${article.id}`, {
        withCredentials: true,
        headers: {
          csrftoken: csrfToken,
        },
      })

      setSuccess(true)
      setError(null)
      setPopupIn(true)
      setDeleteIn(false)
      remove(article.id)
    } catch (e) {
      if (
        e.response &&
        e.response.data &&
        e.response.data.error === "No article found with this id and editor id!"
      ) {
        setError("Artigo não encontrado!")
      } else {
        setError("Algo de errado aconteceu!")
      }

      setPopupIn(true)
      setSuccess(false)
      setDeleteIn(false)
      setWaitingOnDelete(false) // no need for finally because the component is unmounted on success
    }
  }

  function copyToClipboard() {
    navigator.clipboard
      .writeText(`localhost:3000/post/${article.id}`)
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
        setOptionsIn(false)
      })
  }

  return (
    <>
      <CSSTransition
        in={messageIn}
        classNames="bottom-message"
        timeout={400}
        unmountOnExit
      >
        <div className="bottom-message">{message}</div>
      </CSSTransition>
      <CSSTransition
        in={unpublishIn}
        timeout={500}
        classNames="modal"
        unmountOnExit
      >
        <div className="modal">
          <div
            onClick={() => {
              setUnpublishIn((prevstate) => !prevstate)
            }}
            className="modal__close-area"
          ></div>
          <CSSTransition
            in={unpublishIn}
            timeout={500}
            classNames="modal__box"
            appear
          >
            <div className="modal__box modal__box">
              <button
                onClick={() => {
                  setUnpublishIn((prevstate) => !prevstate)
                }}
                className="modal__close-btn"
              >
                <FaTimes />
              </button>
              <div className="modal__content modal__content--fit-content-small">
                <div className="logout__modal">
                  <div className="logout__modal-header">Despublicar</div>
                  <form onSubmit={confirmUnpublish} className="form">
                    <p className="form__heading">Tem certeza?</p>
                    <p className="form__description">
                      Como você não está validado, não poderá publicar o post
                      novamente no momento!
                    </p>
                    <button
                      type="submit"
                      className={
                        !waitingOnConfirmUnpublish
                          ? "btn-primary btn-primary--color-red btn-primary--thick"
                          : "btn-primary btn-primary--color-red btn-primary--thick u-disabled-btn"
                      }
                    >
                      <div className="btn-primary--text">Confirmar</div>
                      {waitingOnConfirmUnpublish ? (
                        <UseAnimation
                          wrapperStyle={{ width: "2.5rem", height: "2.5rem" }}
                          animation={loading}
                          strokeColor="#ffffff"
                        />
                      ) : null}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </CSSTransition>
        </div>
      </CSSTransition>
      <CSSTransition
        in={deleteIn}
        timeout={500}
        classNames="modal"
        unmountOnExit
      >
        <div className="modal">
          <div
            onClick={() => {
              setDeleteIn((prevstate) => !prevstate)
            }}
            className="modal__close-area"
          ></div>
          <CSSTransition
            in={deleteIn}
            timeout={500}
            classNames="modal__box"
            appear
          >
            <div className="modal__box modal__box">
              <button
                onClick={() => {
                  setDeleteIn((prevstate) => !prevstate)
                }}
                className="modal__close-btn"
              >
                <FaTimes />
              </button>
              <div className="modal__content modal__content--fit-content-small">
                <div className="logout__modal">
                  <div className="logout__modal-header">Apagar</div>
                  <form onSubmit={handleDelete} className="form">
                    <p className="form__heading">Tem certeza?</p>
                    <p className="form__description">Essa ação é permanente!</p>
                    <button
                      type="submit"
                      className={
                        !waitingOnDelete
                          ? "btn-primary btn-primary--color-red btn-primary--thick"
                          : "btn-primary btn-primary--color-red btn-primary--thick u-disabled-btn"
                      }
                    >
                      <div className="btn-primary--text">Confirmar</div>
                      {waitingOnDelete ? (
                        <UseAnimation
                          wrapperStyle={{ width: "2.5rem", height: "2.5rem" }}
                          animation={loading}
                          strokeColor="#ffffff"
                        />
                      ) : null}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </CSSTransition>
        </div>
      </CSSTransition>
      <CSSTransition
        in={optionsIn}
        timeout={500}
        classNames="modal"
        unmountOnExit
      >
        <div className="modal">
          <div
            onClick={() => {
              setOptionsIn((prevstate) => !prevstate)
            }}
            className="modal__close-area"
          ></div>
          <CSSTransition
            in={optionsIn}
            timeout={500}
            classNames="modal__box"
            appear
          >
            <div className="modal__box modal__box">
              <button
                onClick={() => {
                  setOptionsIn((prevstate) => !prevstate)
                }}
                className="modal__close-btn"
              >
                <FaTimes />
              </button>
              <div className="modal__content modal__content--fit-content-small">
                {user && user.isValidated ? (
                  <Link
                    to={`/update/post/${article.id}`}
                    className="dashboard__option"
                  >
                    Editar
                  </Link>
                ) : null}
                <Link
                  to={`/preview/post/${article.id}`}
                  className="dashboard__option"
                >
                  Preview
                </Link>
                <button
                  onClick={handleTogglePublish}
                  className={
                    !waitingOnTogglePublish
                      ? "dashboard__option"
                      : "dashboard__option u-discreet-disabled-btn"
                  }
                >
                  {article.isPublished ? "Despublicar" : "Publicar"}
                  {waitingOnTogglePublish ? (
                    <>
                      &nbsp;&nbsp;
                      <UseAnimation
                        wrapperStyle={{ width: "2.5rem", height: "2.5rem" }}
                        animation={loading}
                        strokeColor="#0092db"
                      />
                    </>
                  ) : null}
                </button>
                {article.isPublished ? (
                  <button
                    onClick={copyToClipboard}
                    className="dashboard__option"
                  >
                    Link
                  </button>
                ) : null}
                <button
                  onClick={() => {
                    setOptionsIn(false)
                    setDeleteIn(true)
                  }}
                  className="dashboard__option"
                >
                  Apagar
                </button>
              </div>
            </div>
          </CSSTransition>
        </div>
      </CSSTransition>
      <div className="dashboard__item">
        <div className="dashboard__item-section">
          <div className="dashboard__item-section--primary">
            {article.title}
          </div>
          <div className="dashboard__item-section--secondary">
            <FiClock />
            &nbsp;&nbsp; {convertTime(new Date(article.createdAt).getTime())}
          </div>
        </div>
        <div className="dashboard__item-section">
          <button
            onClick={() => {
              setOptionsIn((prevstate) => !prevstate)
            }}
            className="dashboard__item-btn-icon"
          >
            <RiSettingsLine />
          </button>
        </div>
      </div>
    </>
  )
}
