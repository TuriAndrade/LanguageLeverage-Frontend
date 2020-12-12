import React, { useState, useContext, useRef, useEffect } from "react"
import TextEditor from "../textEditor"
import ControlledInput from "../controlledInput"
import { CsrfContext } from "../context"
import PopupMessage from "../popupMessage"

import { CSSTransition } from "react-transition-group"

import { atMost100, atMost50, verifyIfBlank } from "../../validators/general"

import api from "../../services/api"

import { useHistory } from "react-router-dom"

import {
  HiPlusCircle,
  FaArrowLeft,
  FaCheck,
  FaPlus,
  FaTimes,
  FiEdit2,
} from "react-icons/all"

import UseAnimation from "react-useanimations"
import loading from "react-useanimations/lib/loading"

export default function EditPost(props) {
  const [html, setHtml] = useState(null)
  const [delta, setDelta] = useState(null)

  const [isPostFinished, setIsPostFinished] = useState(false)

  const [title, setTitle] = useState("")
  const [errorTitle, setErrorTitle] = useState(null)
  const [categories, setCategories] = useState([])
  const [cover, setCover] = useState(null)
  const [errorCover, setErrorCover] = useState(null)
  const [coverUploading, setCoverUploading] = useState(false)
  const [isPublished, setIsPublished] = useState(false)

  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [popupIn, setPopupIn] = useState(false)

  const [waitingOnSubmit, setWaitingOnSubmit] = useState(false)

  const [category, setCategory] = useState("")

  const { csrfToken } = useContext(CsrfContext)
  const categoriesInput = useRef()
  const history = useHistory()

  useEffect(() => {
    if (props.post) {
      setHtml(props.post ? props.post.html : null)
      setDelta(props.post ? props.post.delta : null)
      setTitle(props.post ? props.post.title : "")
      setCover(props.post ? props.post.cover : null)
      setIsPublished(props.post ? props.post.isPublished : null)
    }

    if (props.categories) {
      setCategories(props.categories)
    }
  }, [props.post, props.categories])

  function onPostSubmit({ html, delta }) {
    setDelta(delta)
    setHtml(html)
    setIsPostFinished(true)
  }

  async function changeCover(e) {
    e.stopPropagation()
    e.preventDefault()

    if (
      e.currentTarget &&
      e.currentTarget.files &&
      e.currentTarget.files.length > 0
    ) {
      try {
        setCoverUploading(true)

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

        setCover(response.data.link)
        setCoverUploading(false)
        setErrorCover(null)
      } catch (e) {
        if (
          e.response &&
          e.response.data &&
          e.response.data.error === "Invalid type!"
        ) {
          setErrorCover("Tipo de arquivo inválido!")
        } else if (
          e.response &&
          e.response.data &&
          e.response.data.error === "File too large"
        ) {
          setErrorCover("Arquivo muito grande!")
        } else {
          setErrorCover("Algum erro ocorreu!")
        }

        setCoverUploading(false)
        setCover(null)
      }
    }
  }

  function addCategory(e) {
    e.preventDefault()
    setCategories([...categories, category])
    setCategory("")
  }

  function removeCategory(e, index) {
    e.preventDefault()

    setCategories(categories.filter((category, i) => i !== index))
  }

  async function handleSubmit(e) {
    e.preventDefault()

    const data = {
      title: verifyIfBlank(title, setErrorTitle),
      cover: verifyIfBlank(cover, setErrorCover),
      html,
      delta,
      isPublished,
    }

    if (data.title && data.cover) {
      try {
        setWaitingOnSubmit(true)

        let articleId = props.post && props.post.id

        if (!props.post) {
          const response = await api.post("/article", data, {
            withCredentials: true,
            headers: {
              csrftoken: csrfToken,
            },
          })

          articleId = response.data.articleId
        } else {
          await api.patch(`/article/${articleId}`, data, {
            withCredentials: true,
            headers: {
              csrftoken: csrfToken,
            },
          })
        }

        await api.patch(
          "/subjects",
          {
            subjects: categories,
            articleId: articleId,
          },
          {
            withCredentials: true,
            headers: {
              csrftoken: csrfToken,
            },
          }
        )

        setSuccess(true)
        setPopupIn(true)
        setError(null)

        setTimeout(() => {
          history.push("/posts")
        }, 1000)
      } catch (e) {
        if (
          e.response &&
          e.response.data &&
          e.response.data.error ===
            "An editor can't have two or more articles with the same title!"
        ) {
          setErrorTitle("Você já tem um post com esse título!")
        } else if (
          e.response &&
          e.response.data &&
          e.response.data.error ===
            "No article found with this id and editor id!"
        ) {
          setError("Esse post não pertence a você ou não existe!")
          setSuccess(null)
          setPopupIn(true)
        } else if (
          e.response &&
          e.response.data &&
          e.response.data.error === "No validated editor found with this id!"
        ) {
          setError("Você não tem permissão para isso no momento!")
          setSuccess(null)
          setPopupIn(true)
        } else {
          setError("Algo de errado aconteceu!")
          setSuccess(null)
          setPopupIn(true)
        }
      } finally {
        setWaitingOnSubmit(false)
      }
    }
  }

  return (
    <>
      <PopupMessage
        error={error}
        success={success}
        setError={setError}
        setSuccess={setSuccess}
        modalIn={popupIn}
        setModalIn={setPopupIn}
      />
      {isPostFinished ? (
        <form onSubmit={handleSubmit} className="dashboard-form">
          <div className="dashboard-form__item">
            <label>Título</label>
            <ControlledInput
              type="text"
              placeholder="Crie um título"
              state={title}
              setState={setTitle}
              formatter={atMost100}
              error={errorTitle}
              inputClass="dashboard-form__input"
              errorClass="dashboard-form__error"
            />
          </div>
          <div className="dashboard-form__item">
            <label>Capa</label>
            <div
              className={
                errorCover
                  ? "dashboard-form__cover dashboard-form__cover--error"
                  : "dashboard-form__cover"
              }
            >
              {coverUploading && !cover ? (
                <UseAnimation
                  wrapperStyle={{
                    width: "6rem",
                    height: "6rem",
                    alignSelf: "center",
                  }}
                  animation={loading}
                  strokeColor="#0092db"
                />
              ) : !coverUploading && !cover ? (
                <>
                  <label htmlFor="dashboard-form__file-input">
                    <HiPlusCircle className="dashboard-form__cover--icon" />
                  </label>
                  <input
                    id="dashboard-form__file-input"
                    type="file"
                    className="dashboard-form__file-input"
                    onChange={changeCover}
                  />
                </>
              ) : (
                <>
                  <img src={cover} alt="Cover"></img>
                  <label
                    htmlFor="dashboard-form__file-input"
                    className="dashboard-form__change-cover-btn"
                  >
                    <FiEdit2 />
                  </label>
                  <input
                    id="dashboard-form__file-input"
                    type="file"
                    className="dashboard-form__file-input"
                    onChange={(e) => {
                      setCover(null)
                      changeCover(e)
                    }}
                  />
                </>
              )}
            </div>
            {errorCover ? (
              <p className="dashboard-form__error">{errorCover}</p>
            ) : null}
          </div>
          <div className="dashboard-form__item">
            <label>Categorias</label>
            <div className="dashboard-form__add-stuff-box">
              <input
                value={category}
                onChange={(e) => atMost50(e.target.value, setCategory)}
                ref={categoriesInput}
                placeholder="Insira uma categoria"
                type="text"
              />
              <button type="button" onClick={addCategory}>
                <FaPlus />
              </button>
            </div>
            <div className="dashboard-form__stuff-container">
              {categories.map((category, index) => (
                <div key={index} className="dashboard-form__stuff">
                  <button
                    onClick={(e) => removeCategory(e, index)}
                    className="dashboard-form__remove-stuff-btn"
                  >
                    <FaTimes />
                  </button>
                  {category}
                </div>
              ))}
            </div>
          </div>
          <div className="dashboard-form__item">
            <label>Publicar</label>
            <button
              type="button"
              onClick={() => setIsPublished((prevstate) => !prevstate)}
              className="dashboard-form__toggle-btn toggle-btn"
            >
              <div className="toggle-btn__option toggle-btn__option--red">
                <FaTimes />
              </div>
              <div className="toggle-btn__option toggle-btn__option--green">
                <FaCheck />
              </div>
              <CSSTransition
                in={isPublished}
                appear
                classNames="toggle-btn__marker"
                timeout={{ appear: 0, enter: 300, exit: 300 }}
              >
                <div className="toggle-btn__marker"></div>
              </CSSTransition>
            </button>
          </div>
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
          <div className="dashboard-form__item">
            <button
              type="button"
              onClick={() => setIsPostFinished(false)}
              className="dashboard-form__back-btn"
            >
              <FaArrowLeft className="dashboard-form__back-btn--icon" />
              <p className="dashboard-form__back-btn--text">Voltar</p>
            </button>
          </div>
        </form>
      ) : (
        <TextEditor initDelta={delta} onSubmit={onPostSubmit} />
      )}
    </>
  )
}
