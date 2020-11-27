import React, { useState, useContext, useEffect } from "react"
import { FiClock, FaTimes, RiSettingsLine } from "react-icons/all"
import { CSSTransition } from "react-transition-group"
import getTimePassed from "../../utils/getTimePassed"
import { Link } from "react-router-dom"
import api from "../../services/api"
import { CsrfContext } from "../context"

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
  const { csrfToken } = useContext(CsrfContext)

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
      }
    } else {
      try {
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
      }
    }
  }

  async function confirmUnpublish(e) {
    e.preventDefault()

    try {
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
    }
  }

  async function handleDelete(e) {
    e.preventDefault()

    try {
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
    }
  }

  return (
    <>
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
                      className="btn-primary btn-primary--color-red btn-primary--thick"
                    >
                      <p className="btn-primary--text">Confirmar</p>
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
                      className="btn-primary btn-primary--color-red btn-primary--thick"
                    >
                      <p className="btn-primary--text">Confirmar</p>
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
                <button className="dashboard__option">Editar</button>
                <Link
                  to={`/preview/post/${article.id}`}
                  className="dashboard__option"
                >
                  Preview
                </Link>
                <button
                  onClick={handleTogglePublish}
                  className="dashboard__option"
                >
                  {article.isPublished ? "Despublicar" : "Publicar"}
                </button>
                <button className="dashboard__option">Link</button>
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
