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
  verifyIfBlank,
} from "../../validators/general"
import { validateEmail } from "../../validators/email"
import { loginRegEx } from "../../validators/login"

import api from "../../services/api"

import { UserContext, CsrfContext } from "../../components/context"

import UseAnimation from "react-useanimations"
import loading from "react-useanimations/lib/loading"

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

  const [isUserSet, setIsUserSet] = useState(false)

  const [pictureUploading, setPictureUploading] = useState(false)

  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const [popupIn, setPopupIn] = useState(false)

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
        setIsUserSet(true)
      })
  }, [
    setName,
    setEmail,
    setLogin,
    setProfilePicture,
    setDescription,
    setIsUserSet,
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
        const file = e.currentTarget.files[0]

        let formData = new FormData()
        formData.append("file", file)

        const response = await api.post("/upload/file", formData, {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
            csrftoken: csrfToken,
          },
          onUploadProgress: (e) => {
            if (e.total > e.loaded) {
              setPictureUploading(true)
            } else {
              setPictureUploading(false)
            }
          },
        })

        setProfilePicture(response.data.link)
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
        } else {
          setError("Algum erro ocorreu!")
        }

        setPopupIn(true)
        setPictureUploading(false)
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
      <LoadingContent loadingIn={!isUserSet} />
      {isUserSet ? (
        <form onSubmit={handleSubmit} className="profile">
          <div className="profile__header">
            <div className="profile__picture">
              <img src={profilePicture || DefaultProfilePic} alt="Profile" />
            </div>
            <div className="profile__user">
              <div className="profile__user--primary">{login}</div>
              <label
                className="profile__user-picture-label"
                htmlFor="profile__user-picture-input"
              >
                <div className="profile__user--secondary">
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
                id="profile__user-picture-input"
                type="file"
                className="profile__user-picture-input"
                onChange={changeProfilePic}
              />
            </div>
          </div>
          <div className="profile__item">
            <label>Nome</label>
            <ControlledInput
              type="text"
              placeholder="Insira seu nome"
              state={name}
              setState={setName}
              formatter={atMost100}
              error={errorName}
              inputClass="profile__input"
              errorClass="profile__error"
            />
          </div>
          <div className="profile__item">
            <label>Email</label>
            <ControlledInput
              type="text"
              placeholder="Insira seu email"
              state={email}
              setState={setEmail}
              error={errorEmail}
              inputClass="profile__input"
              errorClass="profile__error"
            />
          </div>
          <div className="profile__item">
            <label>Login</label>
            <ControlledInput
              type="text"
              placeholder="Insira seu login"
              state={login}
              formatter={loginRegEx}
              setState={setLogin}
              error={errorLogin}
              inputClass="profile__input"
              errorClass="profile__error"
            />
          </div>
          <div className="profile__item">
            <label>Senha</label>
            <button className="profile__change-password-btn">
              Alterar senha
            </button>
          </div>
          {user && user.isEditor ? (
            <div className="profile__item">
              <label>Descrição</label>
              <ControlledInput
                element="textarea"
                placeholder="Insira sua descrição"
                type="text"
                formatter={atMost200}
                state={description}
                setState={setDescription}
                error={errorDescription}
                inputClass="profile__input"
                errorClass="profile__error"
              />
              <div className="profile__item-description">
                Escreva um pouco sobre você! Pode ser da forma como quiser.
                Assim, seus leitores podem te conhecer um pouco melhor!
              </div>
            </div>
          ) : null}
          {user && user.isEditor && !user.isValidated ? (
            <div className="profile__item">
              <label>Status</label>
              <div className="profile__warning profile__warning--red">
                Você não pode publicar no momento &nbsp;
                <span role="img" aria-label="sad emoji">
                  &#128546;
                </span>
              </div>
            </div>
          ) : user && user.isEditor && user.isValidated ? (
            <div className="profile__item">
              <label>Status</label>
              <div className="profile__warning profile__warning--green">
                Você pode publicar no momento &nbsp;
                <span role="img" aria-label="happy emoji">
                  &#128513;
                </span>
              </div>
            </div>
          ) : null}
          {user && user.isAdmin && !user.hasFullPermission ? (
            <div className="profile__item">
              <label>Permissões</label>
              <div className="profile__warning profile__warning--red">
                Você não é um administrador pleno &nbsp;
                <span role="img" aria-label="sad emoji">
                  &#128546;
                </span>
              </div>
            </div>
          ) : user && user.isAdmin && user.hasFullPermission ? (
            <div className="profile__item">
              <label>Permissões</label>
              <div className="profile__warning profile__warning--green">
                Você é um administrador pleno &nbsp;
                <span role="img" aria-label="happy emoji">
                  &#128513;
                </span>
              </div>
            </div>
          ) : null}
          <div className="profile__item">
            <button
              type="submit"
              className="btn-primary btn-primary--color-primary btn-primary--thick profile__submit-btn"
            >
              <div className="btn-primary--text">Enviar</div>
            </button>
          </div>
        </form>
      ) : null}
    </>
  )
}

export default scrollToTop({ component: Profile })
