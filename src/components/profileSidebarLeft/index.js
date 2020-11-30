import React, { useState, useContext } from "react"
import { CSSTransition } from "react-transition-group"

import BrazilIcon from "../../assets/Icons/icon-brazil-flag.png"
import SapinlIcon from "../../assets/Icons/icon-spain-flag.png"
import UkIcon from "../../assets/Icons/icon-uk-flag.png"

import {
  CgProfile,
  CgLogOut,
  RiHomeLine,
  RiSettingsLine,
  FaCheck,
} from "react-icons/all"

import { ThemeContext, LanguageContext } from "../context"
import { Link, useRouteMatch } from "react-router-dom"

import EditorItems from "./editorItems"
import AdminItems from "./adminItems"

export default function ProfileSidebarLeft() {
  const { theme, setTheme } = useContext(ThemeContext)
  const { language, setLanguage } = useContext(LanguageContext)
  const [optionsIn, setOptionsIn] = useState(false)

  const home = useRouteMatch({
    path: "/",
    exact: true,
  })

  const profile = useRouteMatch({
    path: "/profile",
  })

  const logout = useRouteMatch({
    path: "/logout",
  })

  return (
    <div className="sidebar">
      <div className="sidebar__menu">
        <div className="sidebar__menu-item-box">
          <Link
            to="/"
            className={
              home
                ? "sidebar__menu-item sidebar__menu-item--active"
                : "sidebar__menu-item"
            }
          >
            <div className="sidebar__menu-icon">
              <RiHomeLine />
            </div>
            <div className="sidebar__menu-text">Home</div>
          </Link>
        </div>
        <div className="sidebar__menu-item-box">
          <Link
            to="/profile"
            className={
              profile
                ? "sidebar__menu-item sidebar__menu-item--active"
                : "sidebar__menu-item"
            }
          >
            <div className="sidebar__menu-icon">
              <CgProfile />
            </div>
            <div className="sidebar__menu-text">Perfil</div>
          </Link>
        </div>
        <div className="sidebar__menu-item-box">
          <CSSTransition
            in={optionsIn}
            classNames="sidebar__menu-item-expand-box"
            timeout={250}
            unmountOnExit
          >
            <div className="sidebar__menu-item-expand-box">
              <div className="sidebar__menu-options-box">
                <div className="sidebar__menu-options-heading">Linguagem</div>
                <div className="sidebar__menu-options-language">
                  <button
                    onClick={() => {
                      setLanguage("pt")
                      localStorage.setItem("language", "pt")
                    }}
                    className="btn-flag"
                  >
                    <img
                      src={BrazilIcon}
                      alt="Language"
                      className="btn-flag__flag"
                    />
                    <div className="btn-flag__text">Português</div>
                    {language === "pt" ? (
                      <div className="btn-flag__active">
                        <FaCheck />
                      </div>
                    ) : null}
                  </button>
                  <button
                    onClick={() => {
                      setLanguage("es")
                      localStorage.setItem("language", "es")
                    }}
                    className="btn-flag"
                  >
                    <img
                      src={SapinlIcon}
                      alt="Language"
                      className="btn-flag__flag"
                    />
                    <div className="btn-flag__text">Español</div>
                    {language === "es" ? (
                      <div className="btn-flag__active">
                        <FaCheck />
                      </div>
                    ) : null}
                  </button>
                  <button
                    onClick={() => {
                      setLanguage("en")
                      localStorage.setItem("language", "en")
                    }}
                    className="btn-flag"
                  >
                    <img
                      src={UkIcon}
                      alt="Language"
                      className="btn-flag__flag"
                    />
                    <div className="btn-flag__text">English</div>
                    {language === "en" ? (
                      <div className="btn-flag__active">
                        <FaCheck />
                      </div>
                    ) : null}
                  </button>
                </div>
                <div className="sidebar__menu-options-heading">Modo</div>
                <div className="sidebar__menu-options-theme">
                  <button
                    onClick={() => {
                      setTheme("dark")
                      localStorage.setItem("theme", "dark")
                    }}
                    className={
                      theme === "dark"
                        ? "btn-color-circle-icon btn-color-circle-icon--active"
                        : "btn-color-circle-icon"
                    }
                  >
                    <div className="btn-color-circle-icon__icon btn-color-circle-icon__icon--black"></div>
                    <div className="btn-color-circle-icon__text">Dark</div>
                  </button>
                  <button
                    onClick={() => {
                      setTheme("light")
                      localStorage.setItem("theme", "light")
                    }}
                    className={
                      theme === "light"
                        ? "btn-color-circle-icon btn-color-circle-icon--active"
                        : "btn-color-circle-icon"
                    }
                  >
                    <div className="btn-color-circle-icon__icon btn-color-circle-icon__icon--white"></div>
                    <div className="btn-color-circle-icon__text">Light</div>
                  </button>
                </div>
                <div className="sidebar__menu-options-footer">
                  <button className="u-margin-top-tiny btn-primary btn-primary--thin btn-primary--w100 btn-primary--color-primary">
                    <div className="btn-primary--text">Personalizar o feed</div>
                  </button>
                </div>
              </div>
            </div>
          </CSSTransition>
          <CSSTransition
            in={optionsIn}
            classNames="sidebar__menu-item"
            timeout={250}
          >
            <button
              onClick={() => {
                setOptionsIn((prevState) => !prevState)
              }}
              className="sidebar__menu-item"
            >
              <div className="sidebar__menu-icon">
                <RiSettingsLine />
              </div>
              <div className="sidebar__menu-text">Opções</div>
            </button>
          </CSSTransition>
        </div>
        <EditorItems />
        <AdminItems />
        <div className="sidebar__menu-item-box">
          <Link
            to="/logout"
            className={
              logout
                ? "sidebar__menu-item sidebar__menu-item--active"
                : "sidebar__menu-item"
            }
          >
            <div className="sidebar__menu-icon">
              <CgLogOut />
            </div>
            <div className="sidebar__menu-text">Logout</div>
          </Link>
        </div>
      </div>
      <div className="sidebar__footer">
        <div className="sidebar__footer--secondary">Developed by</div>
        <a
          href="https://github.com/TuriAndrade"
          className="sidebar__footer--primary"
        >
          Turi Andrade
        </a>
      </div>
    </div>
  )
}
