import React from "react"
import { CSSTransition } from "react-transition-group"
import { FaTimesCircle, FaCheckCircle, FaTimes } from "react-icons/all"

export default function PopupMessage({
  modalIn,
  setModalIn,
  error,
  setError,
  success,
  setSuccess,
  disappear = true,
}) {
  return (
    <CSSTransition
      onExited={() => {
        setSuccess && setSuccess(null)
        setError && setError(null)
      }}
      in={modalIn}
      timeout={{ enter: 1000, exit: 500 }}
      onEntered={() => disappear && setModalIn(false)}
      classNames="modal"
      unmountOnExit
    >
      <div className="modal">
        <div
          onClick={() => {
            setModalIn(false)
          }}
          className="modal__close-area"
        ></div>
        <CSSTransition
          in={modalIn}
          timeout={{ enter: 1000, exit: 500 }}
          classNames="modal__box"
          appear
        >
          <div className="modal__box modal__box">
            <button
              onClick={() => {
                setModalIn(false)
              }}
              className="modal__close-btn"
            >
              <FaTimes />
            </button>
            <div className="modal__content modal__content--small-box">
              <div className="popup-message">
                <div
                  className={
                    error
                      ? "popup-message__icon popup-message__icon--error"
                      : "popup-message__icon popup-message__icon--sucess"
                  }
                >
                  {error ? <FaTimesCircle /> : <FaCheckCircle />}
                </div>
                {(error && typeof error !== "boolean") ||
                (success && typeof success !== "boolean") ? (
                  <div
                    className={
                      error
                        ? "popup-message__text popup-message__text--error"
                        : "popup-message__text popup-message__text--sucess"
                    }
                  >
                    {error || success}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </CSSTransition>
      </div>
    </CSSTransition>
  )
}
