import React, { useState } from "react"
import { FaTimes, BiImageAlt, FiVideo, AiOutlineSound } from "react-icons/all"
import { CSSTransition } from "react-transition-group"
import { verifyIfBlank } from "../../validators/general"
import ControlledInput from "../controlledInput"

export function Link({ editor, modalIn, toggleModal }) {
  const [link, setLink] = useState("")
  const [errorLink, setErrorLink] = useState(null)

  function handleSubmit(e) {
    e.preventDefault()

    const verifiedLink = verifyIfBlank(link, setErrorLink)

    if (verifiedLink) {
      editor.format("link", verifiedLink)
      toggleModal()
      setLink("")
    }
  }

  return (
    <CSSTransition in={modalIn} timeout={500} classNames="modal" unmountOnExit>
      <div className="modal">
        <div
          onClick={() => {
            toggleModal()
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
                toggleModal()
              }}
              className="modal__close-btn"
            >
              <FaTimes />
            </button>
            <div className="modal__content modal__content--fit-content-small">
              <div className="text-editor__modal">
                <div className="text-editor__modal-header">Link</div>
                <form className="form">
                  <div className="form__input-box">
                    <ControlledInput
                      type="text"
                      placeholder="Link"
                      state={link}
                      setState={setLink}
                      error={errorLink}
                      inputClass="form__input"
                      errorClass="form__error"
                    />
                  </div>
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    className="btn-primary btn-primary--color-primary btn-primary--thick"
                  >
                    <p className="btn-primary--text">Inserir</p>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </CSSTransition>
      </div>
    </CSSTransition>
  )
}

export function LinkFile({ editor, modalIn, toggleModal, Quill }) {
  const [link, setLink] = useState("")
  const [errorLink, setErrorLink] = useState(null)
  const [fileType, setFileType] = useState(null)

  function handleSubmit(e) {
    e.preventDefault()

    const verifiedLink = verifyIfBlank(link, setErrorLink)

    if (verifiedLink) {
      editor.focus()

      const range = editor.getSelection(true)
      const position = range ? range.index : 0

      editor.insertEmbed(
        position,
        fileType,
        {
          src: verifiedLink,
          alt: fileType,
        },
        Quill.sources.USER
      )
      editor.setSelection(position + 1, Quill.sources.SILENT)

      toggleModal()
    }
  }

  return (
    <CSSTransition in={modalIn} timeout={500} classNames="modal" unmountOnExit>
      <div className="modal">
        <div
          onClick={() => {
            toggleModal()
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
                toggleModal()
              }}
              className="modal__close-btn"
            >
              <FaTimes />
            </button>
            <div className="modal__content modal__content--fit-content-small">
              <div className="text-editor__modal">
                <div className="text-editor__modal-header">File</div>
                <form className="form">
                  <div className="form__btn-row">
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        setFileType("image")
                      }}
                      className={
                        fileType === "image"
                          ? "border-btn border-btn--active"
                          : "border-btn"
                      }
                    >
                      <div className="border-btn__icon">
                        <BiImageAlt />
                      </div>
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        setFileType("video")
                      }}
                      className={
                        fileType === "video"
                          ? "border-btn border-btn--active"
                          : "border-btn"
                      }
                    >
                      <div className="border-btn__icon">
                        <FiVideo />
                      </div>
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        setFileType("audio")
                      }}
                      className={
                        fileType === "audio"
                          ? "border-btn border-btn--active"
                          : "border-btn"
                      }
                    >
                      <div className="border-btn__icon">
                        <AiOutlineSound />
                      </div>
                    </button>
                  </div>
                  <div className="form__input-box">
                    <ControlledInput
                      type="text"
                      placeholder="Link"
                      state={link}
                      setState={setLink}
                      error={errorLink}
                      inputClass="form__input"
                      errorClass="form__error"
                    />
                  </div>
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    className={
                      !fileType
                        ? "btn-primary btn-primary--color-primary btn-primary--thick u-disabled-btn"
                        : "btn-primary btn-primary--color-primary btn-primary--thick"
                    }
                  >
                    <p className="btn-primary--text">Inserir</p>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </CSSTransition>
      </div>
    </CSSTransition>
  )
}
