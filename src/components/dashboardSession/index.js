import React, { useState, useContext } from "react"
import {
  FiClock,
  FiTrash2,
  HiOutlineLocationMarker,
  FaTimes,
  GoVerified,
} from "react-icons/all"
import { CSSTransition } from "react-transition-group"

import ControlledInput from "../controlledInput"

import api from "../../services/api"

import { passwordRegEx } from "../../validators/password"
import { verifyIfBlank } from "../../validators/general"

import getTimePassed from "../../utils/getTimePassed"

import { UserContext, CsrfContext } from "../../components/context"

export default function DashboardSession({
  session,
  remove,
  setError,
  setSuccess,
  setPopupIn,
}) {
  const { setUser } = useContext(UserContext)
  const { csrfToken, setCsrfToken } = useContext(CsrfContext)

  const [modalIn, setModalIn] = useState(false)

  const [password, setPassword] = useState("")
  const [errorPassword, setErrorPassword] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()

    const data = {
      password: verifyIfBlank(password, setErrorPassword),
      sessions: [session.id],
    }

    if (data.password) {
      try {
        const response = await api.post("/delete/session", data, {
          withCredentials: true,
          headers: {
            csrftoken: csrfToken,
          },
        })

        if (response.data && response.data.thisSessionIncluded) {
          const CsrfContext = await api.get("/generic/csrf/token")

          setError(null)
          setSuccess(true)
          setPopupIn(true)
          setModalIn(false)

          setTimeout(() => {
            setUser(null)
            setCsrfToken(CsrfContext.data.token)
          }, 1000)
        } else {
          setError(null)
          setSuccess(true)
          setPopupIn(true)
          setModalIn(false)
          remove(session.id)
        }
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
          setModalIn(false)
        }
      }
    }
  }

  function getLocation(locationArray) {
    let location = null

    locationArray.map((entry) => {
      if (entry) {
        if (location) {
          location += ", " + entry
        } else {
          location = entry
        }
      }

      return null
    })

    return location || "Local não encontrado!"
  }

  function convertTime(timestamp) {
    const time = getTimePassed(timestamp)

    if (!time) {
      return "Data não encontrada!"
    } else {
      return `${time.n}${time.unit}`
    }
  }

  return (
    <div className="dashboard__item">
      <CSSTransition
        in={modalIn}
        timeout={500}
        classNames="modal"
        unmountOnExit
      >
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
              <div className="modal__content modal__content--fit-content-small">
                <div className="logout__modal">
                  <div className="logout__modal-header">Logout</div>
                  <form onSubmit={handleSubmit} className="form">
                    <p className="form__heading">Tem certeza?</p>
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
      <div className="dashboard__item-section">
        <div className="dashboard__item-section--secondary">
          <HiOutlineLocationMarker />
          &nbsp;&nbsp;
          {getLocation([session.city, session.region, session.country])}
        </div>
        <div className="dashboard__item-section--tertiary">
          <FiClock />
          &nbsp;&nbsp; {convertTime(session.date)}
        </div>
        {session.active ? (
          <div className="dashboard__item-section--secondary dashboard__item-section--active">
            <GoVerified />
            &nbsp;&nbsp; Ativa
          </div>
        ) : null}
      </div>
      <div className="dashboard__item-section">
        <button
          onClick={() => setModalIn((prevstate) => !prevstate)}
          className="btn-icon-3 btn-icon-3--red"
        >
          <FiTrash2 />
        </button>
      </div>
    </div>
  )
}
