import React, { useRef, useState, useContext } from "react"
import { useHistory } from "react-router-dom"

import DefaultBottombar from "../../components/defaultBottombar"
import scrollToTop from "../../components/scrollToTop"
import ControlledInput from "../../components/controlledInput"
import PopupMessage from "../../components/popupMessage"

import { FiArrowDownCircle } from "react-icons/all"

import Typist from "react-typist"

import { CSSTransition } from "react-transition-group"

import Logo from "../../assets/Logo.png"

import api from "../../services/api"

import { CsrfContext } from "../../components/context"

import {
  atMost100,
  atMost200,
  verifyIfBlank,
  atLeast4,
  atLeast8,
} from "../../validators/general"
import { validateEmail } from "../../validators/email"
import { loginRegEx } from "../../validators/login"
import { passwordRegEx } from "../../validators/password"

function Register() {
  const { csrfToken } = useContext(CsrfContext)

  const history = useHistory()

  const formContainer = useRef()

  const [name, setName] = useState("")
  const [errorName, setErrorName] = useState(null)

  const [email, setEmail] = useState("")
  const [errorEmail, setErrorEmail] = useState(null)

  const [emailCheck, setEmailCheck] = useState("")
  const [errorEmailCheck, setErrorEmailCheck] = useState(null)

  const [login, setLogin] = useState("")
  const [errorLogin, setErrorLogin] = useState(null)

  const [password, setPassword] = useState("")
  const [errorPassword, setErrorPassword] = useState(null)

  const [passwordCheck, setPasswordCheck] = useState("")
  const [errorPasswordCheck, setErrorPasswordCheck] = useState(null)

  const [description, setDescription] = useState("")
  const [errorDescription, setErrorDescription] = useState(null)

  const [error, setError] = useState(null)
  const [sucess, setSuccess] = useState(null)

  const [popupIn, setPopupIn] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()

    const data = {
      name: verifyIfBlank(name, setErrorName),
      email: validateEmail(email, setErrorEmail),
      emailCheck: verifyIfBlank(emailCheck, setErrorEmailCheck),
      login: atLeast4(login, setErrorLogin),
      password: atLeast8(password, setErrorPassword),
      passwordCheck: verifyIfBlank(passwordCheck, setErrorPasswordCheck),
      description: verifyIfBlank(description, setErrorDescription),
    }

    if (
      data.name &&
      data.email &&
      data.emailCheck &&
      data.login &&
      data.password &&
      data.passwordCheck &&
      data.description
    ) {
      if (passwordCheck !== password) {
        setErrorPasswordCheck("As senhas não são iguais!")
      } else if (emailCheck !== email) {
        setErrorEmailCheck("Os emails não são iguais!")
      } else {
        try {
          await api.post("/editor", data, {
            withCredentials: true,
            headers: {
              csrftoken: csrfToken,
            },
          })

          setError(null)
          setSuccess(true)
          setPopupIn(true)

          setTimeout(() => {
            history.push("/login")
          }, 1000)
        } catch (e) {
          if (
            e.response &&
            e.response.data &&
            e.response.data.error === "Login already exists!"
          ) {
            setErrorLogin("Login em uso!")
          } else if (
            e.response &&
            e.response.data &&
            e.response.data.error === "Email already exists!"
          ) {
            setErrorEmail("Email em uso!")
          } else {
            setSuccess(null)
            setError("Algo de errado aconteceu!")
            setPopupIn(true)
          }
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
            <div className="fullpage-form__heading-text--secondary">
              No LangLev
            </div>
          </CSSTransition>
          <Typist cursor={{ show: false }} startDelay={600}>
            <div className="fullpage-form__heading-text--primary">
              você se cadastra e escreve textos incríveis para ajudar pessoas de
              todo o Brasil a aprender inglês!
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
          <div className="form__heading">Inscreva-se e comece a escrever.</div>
          <div className="form__input-box">
            <label>Qual é o seu nome?</label>
            <ControlledInput
              type="text"
              placeholder="Insira seu nome"
              state={name}
              setState={setName}
              formatter={atMost100}
              error={errorName}
              inputClass="form__input"
              errorClass="form__error"
            />
          </div>
          <div className="form__input-box">
            <label>Qual é o seu email ?</label>
            <ControlledInput
              type="text"
              placeholder="Insira seu email"
              state={email}
              setState={setEmail}
              error={errorEmail}
              inputClass="form__input"
              errorClass="form__error"
            />
          </div>
          <div className="form__input-box">
            <label>Confirme seu email</label>
            <ControlledInput
              type="text"
              placeholder="Insira seu email"
              state={emailCheck}
              setState={setEmailCheck}
              error={errorEmailCheck}
              inputClass="form__input"
              errorClass="form__error"
            />
          </div>
          <div className="form__input-box">
            <label>Crie um login</label>
            <ControlledInput
              type="text"
              placeholder="Insira seu login"
              state={login}
              formatter={loginRegEx}
              setState={setLogin}
              error={errorLogin}
              inputClass="form__input"
              errorClass="form__error"
            />
          </div>
          <div className="form__input-box">
            <label>Crie uma senha</label>
            <ControlledInput
              placeholder="Insira sua senha"
              type="password"
              formatter={passwordRegEx}
              state={password}
              setState={setPassword}
              error={errorPassword}
              inputClass="form__input"
              errorClass="form__error"
            />
          </div>
          <div className="form__input-box">
            <label>Confirme sua senha</label>
            <ControlledInput
              placeholder="Insira sua senha"
              type="password"
              formatter={passwordRegEx}
              state={passwordCheck}
              setState={setPasswordCheck}
              error={errorPasswordCheck}
              inputClass="form__input"
              errorClass="form__error"
            />
          </div>
          <div className="form__input-box">
            <label>Escreva um pouco sobre você!</label>
            <ControlledInput
              element="textarea"
              placeholder="Insira sua descrição"
              type="text"
              formatter={atMost200}
              state={description}
              setState={setDescription}
              error={errorDescription}
              inputClass="form__input"
              errorClass="form__error"
            />
          </div>
          <button
            type="submit"
            className="btn-primary btn-primary--color-primary btn-primary--thick btn-primary--w100"
          >
            <div className="btn-primary--text">Cadastre-se</div>
          </button>
        </form>
      </div>
      <div className="fullpage-form__footer">
        <DefaultBottombar />
      </div>
    </div>
  )
}

export default scrollToTop({ component: Register })
