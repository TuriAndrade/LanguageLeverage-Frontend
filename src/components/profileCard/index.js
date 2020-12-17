import React, { useState, useContext } from "react"
import DefaultProfilePic from "../../assets/default-profile-picture.png"
import { CSSTransition } from "react-transition-group"
import {
  FiMail,
  FiAtSign,
  FiUser,
  FaTimes,
  RiSettingsLine,
  GrRotateLeft,
  GoVerified,
} from "react-icons/all"
import api from "../../services/api"
import { CsrfContext } from "../context"
import { Link } from "react-router-dom"
import UseAnimation from "react-useanimations"
import loading from "react-useanimations/lib/loading"
import Img from "react-cool-img"

export default function ProfileCard({
  user,
  admin,
  editor,
  toggleValidate,
  remove,
  grantFullPermission,
  setError,
  setSuccess,
  setPopupIn,
}) {
  const [expandInfo, setExpandInfo] = useState(false)
  const [rotate, setRotate] = useState(false)
  const [optionsIn, setOptionsIn] = useState(false)
  const [deleteIn, setDeleteIn] = useState(false)
  const [grantPermissionIn, setGrantPermissionIn] = useState(false)
  const [waitingOnToggleValidate, setWaitingOnToggleValidate] = useState(false)
  const [waitingOnDelete, setWaitingOnDelete] = useState(false)

  const { csrfToken } = useContext(CsrfContext)

  async function handleToggleValidate() {
    if (editor && editor.id) {
      try {
        setWaitingOnToggleValidate(true)

        if (!editor.isValidated) {
          await api.patch(`/validate/editor/${editor.id}`, null, {
            withCredentials: true,
            headers: {
              csrftoken: csrfToken,
            },
          })
        } else {
          await api.patch(`/invalidate/editor/${editor.id}`, null, {
            withCredentials: true,
            headers: {
              csrftoken: csrfToken,
            },
          })
        }

        setOptionsIn(false)
        setSuccess(true)
        setError(null)
        setPopupIn(true)
        toggleValidate(editor.id)
      } catch (e) {
        setOptionsIn(false)
        setSuccess(false)
        setError("Algum erro aconteceu!")
        setPopupIn(true)
        setWaitingOnToggleValidate(false)
      }
    }
  }

  async function handleDelete(e) {
    e.preventDefault()

    if (user && user.id) {
      try {
        setWaitingOnDelete(true)

        await api.delete(`/any/user/${user.id}`, {
          withCredentials: true,
          headers: {
            csrftoken: csrfToken,
          },
        })

        setSuccess(true)
        setDeleteIn(false)
        setError(null)
        setPopupIn(true)
        remove(editor && editor.id)
      } catch (e) {
        if (
          e.response &&
          e.response.data &&
          e.response.data.error === "You can't delete a fully permitted admin!"
        ) {
          setError("Você não tem permissão para isso!")
        } else {
          setError("Algum erro aconteceu!")
        }

        setSuccess(null)
        setDeleteIn(false)
        setPopupIn(true)
        setWaitingOnDelete(false)
      }
    }
  }

  async function handleGrantFullPermission() {}

  return (
    <>
      <CSSTransition
        in={grantPermissionIn}
        timeout={500}
        classNames="modal"
        unmountOnExit
      >
        <div className="modal">
          <div
            onClick={() => {
              setGrantPermissionIn((prevstate) => !prevstate)
            }}
            className="modal__close-area"
          ></div>
          <CSSTransition
            in={grantPermissionIn}
            timeout={500}
            classNames="modal__box"
            appear
          >
            <div className="modal__box modal__box">
              <button
                onClick={() => {
                  setGrantPermissionIn((prevstate) => !prevstate)
                }}
                className="modal__close-btn"
              >
                <FaTimes />
              </button>
              <div className="modal__content modal__content--fit-content-small">
                <div className="logout__modal">
                  <div className="logout__modal-header">
                    Dar permissão total
                  </div>
                  <form onSubmit={handleGrantFullPermission} className="form">
                    <p className="form__heading">Tem certeza?</p>
                    <p className="form__description">
                      Essa ação é irreversível!
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
                    <p className="form__description">
                      Essa ação é irreversível!
                    </p>
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
      {admin && admin.hasFullPermission ? null : (
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
                  {admin ? (
                    admin.hasFullPermission ? null : (
                      <>
                        <button
                          onClick={() => {
                            setOptionsIn(false)
                            setGrantPermissionIn(true)
                          }}
                          className="profile-card__option"
                        >
                          Dar permissão total
                        </button>
                        <button
                          onClick={() => {
                            setOptionsIn(false)
                            setDeleteIn(true)
                          }}
                          className="profile-card__option"
                        >
                          Excluir
                        </button>
                      </>
                    )
                  ) : (
                    <>
                      <button
                        onClick={handleToggleValidate}
                        className={
                          !waitingOnToggleValidate
                            ? "dashboard__option"
                            : "dashboard__option u-discreet-disabled-btn"
                        }
                      >
                        {editor.isValidated ? "Invalidar" : "Validar"}
                        {waitingOnToggleValidate ? (
                          <>
                            &nbsp;&nbsp;
                            <UseAnimation
                              wrapperStyle={{
                                width: "2.5rem",
                                height: "2.5rem",
                              }}
                              animation={loading}
                              strokeColor="#0092db"
                            />
                          </>
                        ) : null}
                      </button>
                      <Link
                        to={`/editor/posts/${editor.id}`}
                        className="profile-card__option"
                      >
                        Ver posts
                      </Link>
                      <button
                        onClick={() => {
                          setOptionsIn(false)
                          setDeleteIn(true)
                        }}
                        className="profile-card__option"
                      >
                        Excluir
                      </button>
                    </>
                  )}
                </div>
              </div>
            </CSSTransition>
          </div>
        </CSSTransition>
      )}
      <div className="profile-card">
        <CSSTransition
          in={rotate}
          timeout={700}
          classNames="profile-card__rotate-btn"
        >
          <button
            onClick={() => {
              setRotate((prevstate) => !prevstate)
            }}
            className="profile-card__rotate-btn"
          >
            <GrRotateLeft />
          </button>
        </CSSTransition>
        {editor ? (
          <CSSTransition
            in={rotate}
            timeout={700}
            classNames="profile-card__info-box-btn--rotate"
          >
            <CSSTransition
              in={expandInfo}
              timeout={600}
              classNames="profile-card__info-box-btn"
            >
              <button
                onClick={() => {
                  setExpandInfo((prevstate) => !prevstate)
                }}
                className="profile-card__info-box-btn"
              ></button>
            </CSSTransition>
          </CSSTransition>
        ) : null}
        <CSSTransition
          in={rotate}
          timeout={700}
          classNames="profile-card__picture-box"
        >
          <div className="profile-card__picture-box">
            <div className="profile-card__picture">
              <Img src={user.picture || DefaultProfilePic} alt="Profile" />
              {admin && admin.isYou ? (
                <div className="profile-card__picture-identifier">
                  <GoVerified /> <p>Você!</p>
                </div>
              ) : null}
              <div className="profile-card__picture-label">
                {admin ? "Admin" : "Editor"}
              </div>
              <div className="profile-card__picture-footer">{user.name}</div>
              {admin && admin.hasFullPermission ? null : (
                <button
                  onClick={() => {
                    setOptionsIn((prevstate) => !prevstate)
                  }}
                  className="profile-card__picture-icon"
                >
                  <RiSettingsLine />
                </button>
              )}
            </div>
          </div>
        </CSSTransition>
        <CSSTransition
          in={rotate}
          timeout={700}
          classNames="profile-card__info-boxes-container"
        >
          <div className="profile-card__info-boxes-container">
            <button
              onClick={() => {
                setRotate((prevstate) => !prevstate)
              }}
              className="profile-card__back-btn"
            >
              <FaTimes />
            </button>
            <CSSTransition
              in={expandInfo}
              timeout={600}
              classNames="profile-card__info-box--1"
            >
              <div className="profile-card__info-box profile-card__info-box--1">
                <div className="profile-card__info-content">
                  <div className="profile-card__info-group profile-card__info-group--row">
                    <div className="profile-card__info-icon">
                      <FiUser />
                    </div>
                    <div className="profile-card__info-text">{user.name}</div>
                  </div>
                  <div className="profile-card__info-group profile-card__info-group--row">
                    <div className="profile-card__info-icon">
                      <FiAtSign />
                    </div>
                    <div className="profile-card__info-text">{user.login}</div>
                  </div>
                  <div className="profile-card__info-group profile-card__info-group--row">
                    <div className="profile-card__info-icon">
                      <FiMail />
                    </div>
                    <div className="profile-card__info-text">{user.email}</div>
                  </div>
                  {admin ? (
                    admin.hasFullPermission ? (
                      <div className="profile-card__info-group profile-card__info-group--row">
                        <div className="profile-card__info-warning profile-card__info-warning--green">
                          Admin pleno
                        </div>
                      </div>
                    ) : (
                      <div className="profile-card__info-group profile-card__info-group--row">
                        <div className="profile-card__info-warning profile-card__info-warning--red">
                          Admin não pleno
                        </div>
                      </div>
                    )
                  ) : editor ? (
                    editor.isValidated ? (
                      <div className="profile-card__info-group profile-card__info-group--row">
                        <div className="profile-card__info-warning profile-card__info-warning--green">
                          Editor validado
                        </div>
                      </div>
                    ) : (
                      <div className="profile-card__info-group profile-card__info-group--row">
                        <div className="profile-card__info-warning profile-card__info-warning--red">
                          Editor não validado
                        </div>
                      </div>
                    )
                  ) : null}
                </div>
              </div>
            </CSSTransition>
            {editor ? (
              <CSSTransition
                in={expandInfo}
                timeout={600}
                classNames="profile-card__info-box--2"
              >
                <div className="profile-card__info-box profile-card__info-box--2">
                  <div className="profile-card__info-content profile-card__info-content--center">
                    <div className="profile-card__info-group profile-card__info-group--column">
                      <div className="profile-card__info-label">About</div>
                      <div className="profile-card__info-text">
                        {editor ? editor.description : null}
                      </div>
                    </div>
                  </div>
                </div>
              </CSSTransition>
            ) : null}
          </div>
        </CSSTransition>
      </div>
    </>
  )
}
