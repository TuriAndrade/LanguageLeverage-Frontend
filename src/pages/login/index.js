import React, { useRef, useState, useContext } from "react"

import DefaultBottombar from "../../components/defaultBottombar"
import scrollToTop from "../../components/scrollToTop"
import ControlledInput from "../../components/controlledInput"
import PopupMessage from "../../components/popupMessage"

import { FiArrowDownCircle } from "react-icons/all"

import Typist from "react-typist"

import { CSSTransition } from "react-transition-group"

import Logo from "../../assets/Logo.png"

import { passwordRegEx } from "../../validators/password"
import { loginRegEx } from "../../validators/login"
import { verifyIfBlank } from "../../validators/general"

import api from "../../services/api"

import { CsrfContext, UserContext } from "../../components/context"

function Login() {
  const { csrfToken, setCsrfToken } = useContext(CsrfContext)
  const { setUser } = useContext(UserContext)

  const formContainer = useRef()

  const [login, setLogin] = useState("")
  const [errorLogin, setErrorLogin] = useState(null)

  const [password, setPassword] = useState("")
  const [errorPassword, setErrorPassword] = useState(null)

  const [error, setError] = useState(null)
  const [sucess, setSuccess] = useState(null)

  const [popupIn, setPopupIn] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()

    const data = {
      login: verifyIfBlank(login, setErrorLogin),
      password: verifyIfBlank(password, setErrorPassword),
    }

    if (data.login && data.password) {
      try {
        const UserContext = await api.post("/session", data, {
          withCredentials: true,
          headers: {
            csrftoken: csrfToken,
          },
        })

        const CsrfContext = await api.get("/specific/csrf/token", {
          withCredentials: true,
        })

        setError(null)
        setSuccess(true)
        setPopupIn(true)

        setTimeout(() => {
          setUser(UserContext.data)
          setCsrfToken(CsrfContext.data.token)
        }, 1000)
      } catch (e) {
        if (
          e.response &&
          e.response.data &&
          e.response.data.error === "Incorrect password!"
        ) {
          setErrorPassword("Senha incorreta!")
        } else if (
          e.response &&
          e.response.data &&
          e.response.data.error === "No user found with this login!"
        ) {
          setErrorLogin("Login não existente!")
        } else {
          setSuccess(null)
          setError("Algo de errado aconteceu!")
          setPopupIn(true)
        }
      }
    }
  }

  return (
    <div className="fullpage-form">
      <PopupMessage
        modalIn={popupIn}
        setModalIn={setPopupIn}
        error={error}
        setError={setError}
        sucess={sucess}
        setSuccess={setSuccess}
      />
      <div className="fullpage-form__heading">
        <div className="fullpage-form__heading-text">
          <CSSTransition
            in={true}
            timeout={500}
            appear
            classNames="fullpage-form__heading-text--secondary"
            unmountOnExit
          >
            <div className="fullpage-form__heading-text--secondary">Entre</div>
          </CSSTransition>
          <Typist cursor={{ show: false }} startDelay={600}>
            <div className="fullpage-form__heading-text--primary">
              e ajude pessoas de todo Brasil a aprender inglês!
            </div>
          </Typist>
        </div>
        <button
          onClick={() => {
            formContainer.current.scrollIntoView({
              behavior: "smooth",
            })
          }}
          className="fullpage-form__heading-btn"
        >
          <FiArrowDownCircle />
        </button>
      </div>
      <div ref={formContainer} className="fullpage-form__form">
        <form onSubmit={handleSubmit} className="form">
          <div className="form__logo-box">
            <img src={Logo} alt="Logo" />
          </div>
          <div className="form__heading">Entre e comece a produzir.</div>
          <div className="form__input-box">
            <label>Login</label>
            <ControlledInput
              type="text"
              placeholder="Login"
              state={login}
              setState={setLogin}
              formatter={loginRegEx}
              error={errorLogin}
              inputClass="form__input"
              errorClass="form__error"
            />
          </div>
          <div className="form__input-box">
            <label>Senha</label>
            <ControlledInput
              placeholder="Senha"
              type="password"
              formatter={passwordRegEx}
              state={password}
              setState={setPassword}
              error={errorPassword}
              inputClass="form__input"
              errorClass="form__error"
            />
          </div>
          <button
            type="submit"
            className="btn-primary btn-primary--color-primary btn-primary--thick btn-primary--w100"
          >
            <div className="btn-primary--text">Entrar</div>
          </button>
        </form>
      </div>
      <div className="fullpage-form__footer">
        <DefaultBottombar />
      </div>
    </div>
  )
}

export default scrollToTop({ component: Login })
