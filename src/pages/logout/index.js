import React, { useEffect, useState, useContext } from "react"
import DashboardSession from "../../components/dashboardSession"
import scrollToTop from "../../components/scrollToTop"
import { FiTrash2, FaTimes } from "react-icons/all"
import api from "../../services/api"
import LoadingContent from "../../components/loadingContent"
import { CSSTransition } from "react-transition-group"

import ControlledInput from "../../components/controlledInput"
import PopupMessage from "../../components/popupMessage"

import { passwordRegEx } from "../../validators/password"
import { verifyIfBlank } from "../../validators/general"

import { UserContext, CsrfContext } from "../../components/context"

function Logout() {
  const [sessions, setSessions] = useState(null)

  const [loadingContent, setLoadingContent] = useState(true)

  const [completeLogoutIn, setCompleteLogoutIn] = useState(false)
  const [simpleLogoutIn, setSimpleLogoutIn] = useState(false)

  const [popupIn, setPopupIn] = useState(false)

  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const { setUser } = useContext(UserContext)
  const { csrfToken, setCsrfToken } = useContext(CsrfContext)

  useEffect(() => {
    api
      .get("/sessions", { withCredentials: true })
      .then((response) => {
        setSessions(response.data.sessions)
        setLoadingContent(false)
      })
      .catch((e) => {
        console.log(e.response)
      })
  }, [])

  const [password, setPassword] = useState("")
  const [errorPassword, setErrorPassword] = useState(null)

  async function logout(e) {
    e.preventDefault()

    try {
      await api.delete("/session", {
        withCredentials: true,
        headers: {
          csrftoken: csrfToken,
        },
      })

      const CsrfContext = await api.get("/generic/csrf/token")

      setError(null)
      setSuccess(true)
      setPopupIn(true)
      setSimpleLogoutIn(false)

      setTimeout(() => {
        setUser(null)
        setCsrfToken(CsrfContext.data.token)
      }, 1000)
    } catch (e) {
      setError("Algo de errado aconteceu!")
      setSuccess(null)
      setPopupIn(true)
      setSimpleLogoutIn(false)
    }
  }

  async function completeLogout(e) {
    e.preventDefault()

    const data = {
      password: verifyIfBlank(password, setErrorPassword),
      sessions: sessions.map((session) => session.id),
    }

    if (data.password) {
      try {
        await api.post("/delete/session", data, {
          withCredentials: true,
          headers: {
            csrftoken: csrfToken,
          },
        })

        const CsrfContext = await api.get("/generic/csrf/token")

        setError(null)
        setSuccess(true)
        setPopupIn(true)
        setCompleteLogoutIn(false)

        setTimeout(() => {
          setUser(null)
          setCsrfToken(CsrfContext.data.token)
        }, 1000)
      } catch (e) {
        if (
          e.response &&
          e.response.data &&
          e.response.data.error === "Incorrect password!"
        ) {
          setErrorPassword("Senha incorreta!")
        } else {
          setError("Algo de errado aconteceu!")
          setSuccess(null)
          setPopupIn(true)
          setCompleteLogoutIn(false)
        }
      }
    }
  }

  function removeSession(id) {
    setSessions((prevstate) => prevstate.filter((entry) => entry.id !== id))
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
      <CSSTransition
        in={simpleLogoutIn}
        timeout={500}
        classNames="modal"
        unmountOnExit
      >
        <div className="modal">
          <div
            onClick={() => {
              setSimpleLogoutIn((prevstate) => !prevstate)
            }}
            className="modal__close-area"
          ></div>
          <CSSTransition
            in={simpleLogoutIn}
            timeout={500}
            classNames="modal__box"
            appear
          >
            <div className="modal__box modal__box">
              <button
                onClick={() => {
                  setSimpleLogoutIn((prevstate) => !prevstate)
                }}
                className="modal__close-btn"
              >
                <FaTimes />
              </button>
              <div className="modal__content modal__content--fit-content-small">
                <div className="logout__modal">
                  <div className="logout__modal-header">Logout</div>
                  <form onSubmit={logout} className="form">
                    <p className="form__heading">Tem certeza?</p>
                    <button
                      type="submit"
                      className="btn-primary btn-primary--color-red btn-primary--thick"
                    >
                      <p className="btn-primary--text">Sair</p>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </CSSTransition>
        </div>
      </CSSTransition>
      <CSSTransition
        in={completeLogoutIn}
        timeout={500}
        classNames="modal"
        unmountOnExit
      >
        <div className="modal">
          <div
            onClick={() => {
              setCompleteLogoutIn((prevstate) => !prevstate)
            }}
            className="modal__close-area"
          ></div>
          <CSSTransition
            in={completeLogoutIn}
            timeout={500}
            classNames="modal__box"
            appear
          >
            <div className="modal__box modal__box">
              <button
                onClick={() => {
                  setCompleteLogoutIn((prevstate) => !prevstate)
                }}
                className="modal__close-btn"
              >
                <FaTimes />
              </button>
              <div className="modal__content modal__content--fit-content-small">
                <div className="logout__modal">
                  <div className="logout__modal-header">Logout</div>
                  <form onSubmit={completeLogout} className="form">
                    <p className="form__heading">Tem certeza?</p>
                    <p className="form__description">
                      Você sairá de todas as sessões em que está logado!
                    </p>
                    <div className="form__input-box">
                      <ControlledInput
                        type="password"
                        placeholder="Senha"
                        state={password}
                        setState={setPassword}
                        error={errorPassword}
                        formatter={passwordRegEx}
                        inputClass="form__input"
                        errorClass="form__error"
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn-primary btn-primary--color-red btn-primary--thick"
                    >
                      <p className="btn-primary--text">Sair</p>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </CSSTransition>
        </div>
      </CSSTransition>
      <LoadingContent loadingIn={loadingContent} />
      {!loadingContent ? (
        <div className="dashboard dashboard--header">
          <div className="dashboard__header">
            <button className="dashboard__header-option dashboard__header-option--active">
              Todas as sessões
            </button>
            <button
              onClick={() => setSimpleLogoutIn((prevstate) => !prevstate)}
              className="dashboard__header-option"
            >
              Sair desta sessão?
            </button>
          </div>
          {sessions.map((session) => (
            <DashboardSession
              key={session.id}
              session={session}
              remove={removeSession}
              setError={setError}
              setSuccess={setSuccess}
              setPopupIn={setPopupIn}
            />
          ))}
          <button
            onClick={() => setCompleteLogoutIn((prevstate) => !prevstate)}
            className="dashboard__item dashboard__item--message dashboard__item--warning"
          >
            <FiTrash2 />
            &nbsp;&nbsp; Sair de todas as sessões
          </button>
        </div>
      ) : null}
    </>
  )
}

export default scrollToTop({ component: Logout })
