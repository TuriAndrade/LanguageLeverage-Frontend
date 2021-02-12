import React, { useState, useEffect, useContext } from "react"
import scrollToTop from "../../components/scrollToTop"
import DefaultProfilePic from "../../assets/default-profile-picture.png"

import ControlledInput from "../../components/controlledInput"
import LoadingContent from "../../components/loadingContent"
import PopupMessage from "../../components/popupMessage"

import {
  atMost100,
  atMost200,
  atLeast4,
  atLeast8,
  verifyIfBlank,
} from "../../validators/general"
import { validateEmail } from "../../validators/email"
import { loginRegEx } from "../../validators/login"
import { passwordRegEx } from "../../validators/password"

import api from "../../services/api"

import { UserContext, CsrfContext } from "../../components/context"

import UseAnimation from "react-useanimations"
import loading from "react-useanimations/lib/loading"

import { FaArrowLeft } from "react-icons/all"
import LazyImage from "../../components/lazyImage"

function Profile() {
  const [name, setName] = useState("")
  const [errorName, setErrorName] = useState(null)

  const [email, setEmail] = useState("")
  const [errorEmail, setErrorEmail] = useState(null)

  const [login, setLogin] = useState("")
  const [errorLogin, setErrorLogin] = useState(null)

  const [description, setDescription] = useState("")
  const [errorDescription, setErrorDescription] = useState(null)

  const [profilePicture, setProfilePicture] = useState(null)

  const [loadingContent, setLoadingContent] = useState(true)

  const [pictureUploading, setPictureUploading] = useState(false)

  const [password, setPassword] = useState("")
  const [errorPassword, setErrorPassword] = useState(null)

  const [newPassword, setNewPassword] = useState("")
  const [errorNewPassword, setErrorNewPassword] = useState(null)

  const [checkNewPassword, setCheckNewPassword] = useState("")
  const [errorCheckNewPassword, setErrorCheckNewPassword] = useState(null)

  const [changePassword, setChangePassword] = useState(false)

  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const [popupIn, setPopupIn] = useState(false)

  const [waitingOnSubmit, setWaitingOnSubmit] = useState(false)
  const [waitingOnPasswordChange, setWaitingOnPasswordChange] = useState(false)

  const { user } = useContext(UserContext)
  const { csrfToken } = useContext(CsrfContext)

  useEffect(() => {
    api
      .get("/user", {
        withCredentials: true,
      })
      .then((response) => {
        const userData = response.data.user

        setName(userData.name)
        setEmail(userData.email)
        setLogin(userData.login)
        setProfilePicture(userData.picture)
        if (userData.editor) setDescription(userData.editor.description)
        setLoadingContent(false)
      })
  }, [
    setName,
    setEmail,
    setLogin,
    setProfilePicture,
    setDescription,
    setLoadingContent,
  ])

  async function handleSubmit(e) {
    e.preventDefault()

    const data = {
      name: verifyIfBlank(name, setErrorName),
      login: atLeast4(login, setErrorLogin),
      email: validateEmail(email, setErrorEmail),
      description:
        user && user.isEditor
          ? verifyIfBlank(description, setErrorDescription)
          : undefined,
      picture: profilePicture || undefined,
    }

    if (data.name && data.login && data.email) {
      if (
        (user && user.isEditor && data.description) ||
        (user && !user.isEditor)
      ) {
        try {
          setWaitingOnSubmit(true)

          await api.patch("/user/data", data, {
            withCredentials: true,
            headers: {
              csrftoken: csrfToken,
            },
          })

          if (user && user.isEditor) {
            await api.patch(
              "/editor/description",
              {
                description: data.description,
              },
              {
                withCredentials: true,
                headers: {
                  csrftoken: csrfToken,
                },
              }
            )
          }

          setSuccess(true)
          setError(null)
          setPopupIn(true)
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
            setError("Algum erro ocorreu!")
          }
        } finally {
          setWaitingOnSubmit(false)
        }
      }
    }
  }

  async function changeProfilePic(e) {
    e.stopPropagation()
    e.preventDefault()

    if (
      e.currentTarget &&
      e.currentTarget.files &&
      e.currentTarget.files.length > 0
    ) {
      try {
        setPictureUploading(true)

        const file = e.currentTarget.files[0]

        e.currentTarget.value = null
        e.target.value = null

        let formData = new FormData()
        formData.append("file", file)

        const response = await api.post("/upload/file", formData, {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
            csrftoken: csrfToken,
          },
        })

        setProfilePicture(response.data.link)
        setPictureUploading(false)
      } catch (e) {
        if (
          e.response &&
          e.response.data &&
          e.response.data.error === "Invalid type!"
        ) {
          setError("Tipo de arquivo inválido!")
        } else if (
          e.response &&
          e.response.data &&
          e.response.data.error === "File too large"
        ) {
          setError("Arquivo muito grande!")
        } else if (
          e.response &&
          e.response.data &&
          (e.response.data.error === "No admin found with this id!" ||
            e.response.data.error === "No validated editor found with this id!")
        ) {
          setError("Você não tem permissão para isso!")
        } else {
          setError("Algum erro ocorreu!")
        }

        setPopupIn(true)
        setPictureUploading(false)
      }
    }
  }

  async function handleChangePassword(e) {
    e.preventDefault()

    const data = {
      oldPassword: verifyIfBlank(password, setErrorPassword),
      newPassword: atLeast8(newPassword, setErrorNewPassword),
      checkNewPassword: verifyIfBlank(
        checkNewPassword,
        setErrorCheckNewPassword
      ),
    }

    if (data.oldPassword && data.newPassword && data.checkNewPassword) {
      if (newPassword !== checkNewPassword) {
        setErrorCheckNewPassword("As senhas não são iguais!")
      } else {
        try {
          setWaitingOnPasswordChange(true)

          await api.patch(
            "user/password",
            {
              oldPassword: data.oldPassword,
              newPassword: data.newPassword,
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
          setPassword("")
          setNewPassword("")
          setCheckNewPassword("")
        } catch (e) {
          if (
            e.response &&
            e.response.data &&
            e.response.data.error === "Incorrect password!"
          ) {
            setErrorPassword("Senha incorreta!")
          } else {
            setError("Algum erro ocorreu!")
          }
        } finally {
          setWaitingOnPasswordChange(false)
        }
      }
    }
  }

  return (
    <>
      <PopupMessage
        modalIn={popupIn}
        setModalIn={setPopupIn}
        error={error}
        setError={setError}
        success={success}
        setSuccess={setSuccess}
      />
      <LoadingContent loadingIn={loadingContent} />
      {!loadingContent ? (
        <>
          {changePassword ? (
            <form onSubmit={handleChangePassword} className="dashboard-form">
              <div className="dashboard-form__header">
                <LazyImage
                  containerClass="dashboard-form__picture"
                  src={profilePicture || DefaultProfilePic}
                  alt="Profile"
                />
                <div className="dashboard-form__user">
                  <div className="dashboard-form__user--primary">{login}</div>
                  <label
                    className="dashboard-form__user-picture-label"
                    htmlFor="dashboard-form__file-input"
                  >
                    <div className="dashboard-form__user--secondary">
                      Alterar foto de perfil
                    </div>
                    {pictureUploading ? (
                      <UseAnimation
                        wrapperStyle={{ width: "3rem", height: "3rem" }}
                        animation={loading}
                        strokeColor="#0092db"
                      />
                    ) : null}
                  </label>
                  <input
                    id="dashboard-form__file-input"
                    type="file"
                    className="dashboard-form__file-input"
                    onChange={changeProfilePic}
                  />
                </div>
              </div>
              <div className="dashboard-form__item">
                <label>Senha atual</label>
                <ControlledInput
                  type="password"
                  placeholder="Senha"
                  state={password}
                  setState={setPassword}
                  formatter={passwordRegEx}
                  error={errorPassword}
                  inputClass="dashboard-form__input"
                  errorClass="dashboard-form__error"
                />
              </div>
              <div className="dashboard-form__item">
                <label>Nova senha</label>
                <ControlledInput
                  type="password"
                  placeholder="Nova senha"
                  state={newPassword}
                  setState={setNewPassword}
                  formatter={passwordRegEx}
                  error={errorNewPassword}
                  inputClass="dashboard-form__input"
                  errorClass="dashboard-form__error"
                />
              </div>
              <div className="dashboard-form__item">
                <label>Repita a nova senha</label>
                <ControlledInput
                  type="password"
                  placeholder="Nova senha"
                  state={checkNewPassword}
                  formatter={passwordRegEx}
                  setState={setCheckNewPassword}
                  error={errorCheckNewPassword}
                  inputClass="dashboard-form__input"
                  errorClass="dashboard-form__error"
                />
              </div>
              <div className="dashboard-form__item">
                <button
                  type="submit"
                  className={
                    !waitingOnPasswordChange
                      ? "btn-primary btn-primary--color-primary btn-primary--thick dashboard-form__submit-btn"
                      : "btn-primary btn-primary--color-primary btn-primary--thick dashboard-form__submit-btn u-disabled-btn"
                  }
                >
                  <div className="btn-primary--text">Confirmar</div>
                  {waitingOnPasswordChange ? (
                    <UseAnimation
                      wrapperStyle={{ width: "2.5rem", height: "2.5rem" }}
                      animation={loading}
                      strokeColor="#ffffff"
                    />
                  ) : null}
                </button>
              </div>
              <div className="dashboard-form__item">
                <button
                  onClick={() => setChangePassword(false)}
                  className="dashboard-form__back-btn"
                >
                  <FaArrowLeft className="dashboard-form__back-btn--icon" />
                  <p className="dashboard-form__back-btn--text">Voltar</p>
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="dashboard-form">
              <div className="dashboard-form__header">
                <LazyImage
                  containerClass="dashboard-form__picture"
                  src={profilePicture || DefaultProfilePic}
                  alt="Profile"
                />
                <div className="dashboard-form__user">
                  <div className="dashboard-form__user--primary">{login}</div>
                  <label
                    className="dashboard-form__user-picture-label"
                    htmlFor="dashboard-form__file-input"
                  >
                    <div className="dashboard-form__user--secondary">
                      Alterar foto de perfil
                    </div>
                    {pictureUploading ? (
                      <UseAnimation
                        wrapperStyle={{ width: "3rem", height: "3rem" }}
                        animation={loading}
                        strokeColor="#0092db"
                      />
                    ) : null}
                  </label>
                  <input
                    id="dashboard-form__file-input"
                    type="file"
                    className="dashboard-form__file-input"
                    onChange={changeProfilePic}
                  />
                </div>
              </div>
              <div className="dashboard-form__item">
                <label>Nome</label>
                <ControlledInput
                  type="text"
                  placeholder="Insira seu nome"
                  state={name}
                  setState={setName}
                  formatter={atMost100}
                  error={errorName}
                  inputClass="dashboard-form__input"
                  errorClass="dashboard-form__error"
                />
              </div>
              <div className="dashboard-form__item">
                <label>Email</label>
                <ControlledInput
                  type="text"
                  placeholder="Insira seu email"
                  state={email}
                  setState={setEmail}
                  error={errorEmail}
                  inputClass="dashboard-form__input"
                  errorClass="dashboard-form__error"
                />
              </div>
              <div className="dashboard-form__item">
                <label>Login</label>
                <ControlledInput
                  type="text"
                  placeholder="Insira seu login"
                  state={login}
                  formatter={loginRegEx}
                  setState={setLogin}
                  error={errorLogin}
                  inputClass="dashboard-form__input"
                  errorClass="dashboard-form__error"
                />
              </div>
              <div className="dashboard-form__item">
                <label>Senha</label>
                <button
                  type="button"
                  onClick={() => setChangePassword(true)}
                  className="dashboard-form__input-btn"
                >
                  Alterar senha
                </button>
              </div>
              {user && user.isEditor ? (
                <div className="dashboard-form__item">
                  <label>Descrição</label>
                  <ControlledInput
                    element="textarea"
                    placeholder="Insira sua descrição"
                    type="text"
                    formatter={atMost200}
                    state={description}
                    setState={setDescription}
                    error={errorDescription}
                    inputClass="dashboard-form__input"
                    errorClass="dashboard-form__error"
                  />
                  <div className="dashboard-form__item-description">
                    Escreva um pouco sobre você! Pode ser da forma como quiser.
                    Assim, seus leitores podem te conhecer um pouco melhor!
                  </div>
                </div>
              ) : null}
              {user && user.isEditor && !user.isValidated ? (
                <div className="dashboard-form__item">
                  <label>Status</label>
                  <div className="dashboard-form__warning dashboard-form__warning--red">
                    Você não pode publicar no momento &nbsp;
                    <span role="img" aria-label="sad emoji">
                      &#128546;
                    </span>
                  </div>
                </div>
              ) : user && user.isEditor && user.isValidated ? (
                <div className="dashboard-form__item">
                  <label>Status</label>
                  <div className="dashboard-form__warning dashboard-form__warning--green">
                    Você pode publicar no momento &nbsp;
                    <span role="img" aria-label="happy emoji">
                      &#128513;
                    </span>
                  </div>
                </div>
              ) : null}
              {user && user.isAdmin && !user.hasFullPermission ? (
                <div className="dashboard-form__item">
                  <label>Permissões</label>
                  <div className="dashboard-form__warning dashboard-form__warning--red">
                    Você não é um administrador pleno &nbsp;
                    <span role="img" aria-label="sad emoji">
                      &#128546;
                    </span>
                  </div>
                </div>
              ) : user && user.isAdmin && user.hasFullPermission ? (
                <div className="dashboard-form__item">
                  <label>Permissões</label>
                  <div className="dashboard-form__warning dashboard-form__warning--green">
                    Você é um administrador pleno &nbsp;
                    <span role="img" aria-label="happy emoji">
                      &#128513;
                    </span>
                  </div>
                </div>
              ) : null}
              <div className="dashboard-form__item">
                <button
                  type="submit"
                  className={
                    !waitingOnSubmit
                      ? "btn-primary btn-primary--color-primary btn-primary--thick dashboard-form__submit-btn"
                      : "btn-primary btn-primary--color-primary btn-primary--thick dashboard-form__submit-btn u-disabled-btn"
                  }
                >
                  <div className="btn-primary--text">Enviar</div>
                  {waitingOnSubmit ? (
                    <UseAnimation
                      wrapperStyle={{ width: "2.5rem", height: "2.5rem" }}
                      animation={loading}
                      strokeColor="#ffffff"
                    />
                  ) : null}
                </button>
              </div>
            </form>
          )}
        </>
      ) : null}
    </>
  )
}

export default scrollToTop({ component: Profile })
