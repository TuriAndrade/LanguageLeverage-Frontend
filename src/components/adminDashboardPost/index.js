import React, { useState, useContext } from "react"
import { FiClock, FaTimes, RiSettingsLine } from "react-icons/all"
import { CSSTransition } from "react-transition-group"
import getTimePassed from "../../utils/getTimePassed"
import { Link } from "react-router-dom"
import api from "../../services/api"
import { CsrfContext } from "../context"
import UseAnimation from "react-useanimations"
import loading from "react-useanimations/lib/loading"
import "dotenv"

export default function AdminDashboardPost({
  article,
  remove,
  unpublish,
  setError,
  setSuccess,
  setPopupIn,
}) {
  const [optionsIn, setOptionsIn] = useState(false)
  const [unpublishIn, setUnpublishIn] = useState(false)
  const [deleteIn, setDeleteIn] = useState(false)
  const [messageIn, setMessageIn] = useState(false)
  const [message, setMessage] = useState(null)
  const [waitingOnDelete, setWaitingOnDelete] = useState(false)
  const [waitingOnUnpublish, setWaitingOnUnpublish] = useState(false)
  const { csrfToken } = useContext(CsrfContext)

  function convertTime(timestamp) {
    const time = getTimePassed(timestamp)

    if (!time) {
      return "Data não encontrada!"
    } else {
      return `${time.n}${time.unit}`
    }
  }

  async function handleUnpublish(e) {
    e.preventDefault()

    try {
      setWaitingOnUnpublish(true)

      await api.patch(`/unpublish/any/article/${article.id}`, null, {
        withCredentials: true,
        headers: {
          csrftoken: csrfToken,
        },
      })

      setSuccess(true)
      setError(null)
      setPopupIn(true)
      setUnpublishIn(false)
      unpublish(article.id)
    } catch (e) {
      if (
        e.response &&
        e.response.data &&
        e.response.data.error === "No published article found with this id!"
      ) {
        setError("Artigo não encontrado!")
      } else {
        setError("Algo de errado aconteceu!")
      }

      setPopupIn(true)
      setSuccess(false)
      setUnpublishIn(false)
      setWaitingOnUnpublish(false) // no need for finally because this component is unmounted on success
    }
  }

  async function handleDelete(e) {
    e.preventDefault()

    try {
      setWaitingOnDelete(true)

      await api.delete(`/any/article/${article.id}`, {
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
        e.response.data.error === "No article found with this id!"
      ) {
        setError("Artigo não encontrado!")
      } else {
        setError("Algo de errado aconteceu!")
      }

      setPopupIn(true)
      setSuccess(false)
      setDeleteIn(false)
      setWaitingOnDelete(false)
    }
  }

  function copyToClipboard() {
    navigator.clipboard
      .writeText(`${process.env.REACT_APP_URL}/post/${article.id}`)
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
        timeout={{ enter: 1200, exit: 400 }}
        onEntered={() => setMessageIn(false)}
        onExited={() => setMessage(null)}
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
                  <form onSubmit={handleUnpublish} className="form">
                    <p className="form__heading">Tem certeza?</p>
                    <p className="form__description">
                      Somente o autor desse post poderá publicá-lo novamente!
                    </p>
                    <button
                      type="submit"
                      className={
                        !waitingOnUnpublish
                          ? "btn-primary btn-primary--color-red btn-primary--thick"
                          : "btn-primary btn-primary--color-red btn-primary--thick u-disabled-btn"
                      }
                    >
                      <div className="btn-primary--text">Confirmar</div>
                      {waitingOnUnpublish ? (
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
                <button className="dashboard__option u-disabled-btn">
                  Sugerir edição
                </button>
                <Link
                  to={`/preview/post/${article.id}`}
                  className="dashboard__option"
                >
                  Preview
                </Link>
                {article.isPublished ? (
                  <button
                    onClick={() => {
                      setOptionsIn(false)
                      setUnpublishIn(true)
                    }}
                    className="dashboard__option"
                  >
                    Despublicar
                  </button>
                ) : null}
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
