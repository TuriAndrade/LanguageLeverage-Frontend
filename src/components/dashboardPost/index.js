import React, { useState } from "react"
import { FiClock, FaTimes, RiSettingsLine } from "react-icons/all"
import { CSSTransition } from "react-transition-group"

export default function DashboardPost() {
  const [optionsIn, setOptionsIn] = useState(false)

  return (
    <>
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
                <button className="dashboard__option">Editar</button>
                <button className="dashboard__option">Preview</button>
                <button className="dashboard__option">Publicar</button>
                <button className="dashboard__option">Link</button>
                <button className="dashboard__option">Apagar</button>
              </div>
            </div>
          </CSSTransition>
        </div>
      </CSSTransition>
      <div className="dashboard__item">
        <div className="dashboard__item-section">
          <div className="dashboard__item-section--primary">Título do post</div>
          <div className="dashboard__item-section--secondary">
            <FiClock />
            &nbsp;&nbsp; 3 days ago
          </div>
        </div>
        <div className="dashboard__item-section">
          <button
            onClick={() => {
              setOptionsIn((prevstate) => !prevstate)
            }}
            className="dashboard__item-btn-icon"
          >
            <RiSettingsLine />
          </button>
        </div>
      </div>
    </>
  )
}
