import React, { useState } from "react"
import ProfilePic from "../../assets/profile-picture.jpg"
import { CSSTransition } from "react-transition-group"
import { FiMail, FiAtSign, FiUser } from "react-icons/fi"
import { FaTimes } from "react-icons/fa"
import { RiSettingsLine } from "react-icons/ri"
import { GrRotateLeft } from "react-icons/gr"

export default function ProfileCard({ user, admin, editor }) {
  const [expandInfo, setExpandInfo] = useState(false)
  const [rotate, setRotate] = useState(false)
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
                <button className="profile-card__option">Invalidar</button>
                <button className="profile-card__option">Ver posts</button>
                <button className="profile-card__option">Excluir</button>
              </div>
            </div>
          </CSSTransition>
        </div>
      </CSSTransition>
      <div className="profile-card">
        <CSSTransition
          in={rotate}
          timeout={700}
          classNames="profile-card__info-box-btn--rotate"
        >
          <CSSTransition
            in={expandInfo}
            timeout={600}
            classNames="profile-card__info-box-btn"
          >
            <button
              onClick={() => {
                setExpandInfo((prevstate) => !prevstate)
              }}
              className="profile-card__info-box-btn"
            ></button>
          </CSSTransition>
        </CSSTransition>
        <CSSTransition
          in={rotate}
          timeout={700}
          classNames="profile-card__rotate-btn"
        >
          <button
            onClick={() => {
              setRotate((prevstate) => !prevstate)
            }}
            className="profile-card__rotate-btn"
          >
            <GrRotateLeft />
          </button>
        </CSSTransition>
        <CSSTransition
          in={rotate}
          timeout={700}
          classNames="profile-card__picture-box"
        >
          <div className="profile-card__picture-box">
            <div className="profile-card__picture">
              <img src={ProfilePic} alt="Profile" />
              <div className="profile-card__picture-label">Editor</div>
              <div className="profile-card__picture-footer">Turi Andrade</div>
              <button
                onClick={() => {
                  setOptionsIn((prevstate) => !prevstate)
                }}
                className="profile-card__picture-icon"
              >
                <RiSettingsLine />
              </button>
            </div>
          </div>
        </CSSTransition>
        <CSSTransition
          in={rotate}
          timeout={700}
          classNames="profile-card__info-boxes-container"
        >
          <div className="profile-card__info-boxes-container">
            <button
              onClick={() => {
                setRotate((prevstate) => !prevstate)
              }}
              className="profile-card__back-btn"
            >
              <FaTimes />
            </button>
            <CSSTransition
              in={expandInfo}
              timeout={600}
              classNames="profile-card__info-box--1"
            >
              <div className="profile-card__info-box profile-card__info-box--1">
                <div className="profile-card__info-content">
                  <div className="profile-card__info-group profile-card__info-group--row">
                    <div className="profile-card__info-icon">
                      <FiUser />
                    </div>
                    <div className="profile-card__info-text">Turi Andrade</div>
                  </div>
                  <div className="profile-card__info-group profile-card__info-group--row">
                    <div className="profile-card__info-icon">
                      <FiAtSign />
                    </div>
                    <div className="profile-card__info-text">turi</div>
                  </div>
                  <div className="profile-card__info-group profile-card__info-group--row">
                    <div className="profile-card__info-icon">
                      <FiMail />
                    </div>
                    <div className="profile-card__info-text">
                      turivasconcelos@gmail.com
                    </div>
                  </div>
                  <div className="profile-card__info-group profile-card__info-group--row">
                    <div className="profile-card__info-warning profile-card__info-warning--red">
                      Editor não validado
                    </div>
                  </div>
                </div>
              </div>
            </CSSTransition>
            <CSSTransition
              in={expandInfo}
              timeout={600}
              classNames="profile-card__info-box--2"
            >
              <div className="profile-card__info-box profile-card__info-box--2">
                <div className="profile-card__info-content profile-card__info-content--center">
                  <div className="profile-card__info-group profile-card__info-group--column">
                    <div className="profile-card__info-label">About</div>
                    <div className="profile-card__info-text">
                      Eu sou o Turi e sou MUUUUITO legal !!!!!! Eu sou o Turi e
                      sou MUUUUITO legal !!!!!! Eu sou o Turi e sou MUUUUITO
                      legal !!!!!! Eu sou o Turi e sou MUUUUITO legal !!!!!!
                    </div>
                  </div>
                </div>
              </div>
            </CSSTransition>
          </div>
        </CSSTransition>
      </div>
    </>
  )
}
