import React, { useContext } from "react"
import { ThemeContext, LanguageContext } from "../../components/context"
import { FaArrowLeft, FaCheck } from "react-icons/all"
import { Link } from "react-router-dom"
import Flags from "country-flag-icons/react/3x2"

import DefaultBottombar from "../../components/defaultBottombar"
import ProfileBottombar from "../../components/profileBottombar"
import scrollToTop from "../../components/scrollToTop"

function Preferences({ location }) {
  const { theme, setTheme } = useContext(ThemeContext)
  const { language, setLanguage } = useContext(LanguageContext)

  return (
    <>
      <div className="settings">
        <div className="settings__main">
          <div className="settings__menu-item settings__menu-item--border-bottom">
            <div className="settings__menu-header">
              <Link
                to={
                  location && location.state && location.state.prevLocation
                    ? location.state.prevLocation
                    : "/"
                }
                className="btn-icon-2 btn-icon-2--primary"
              >
                <FaArrowLeft />
              </Link>
              <p>Opções</p>
            </div>
          </div>
          <div className="settings__menu-item">
            <div className="preferences__heading">Linguagem</div>
          </div>
          <div className="settings__menu-item">
            <div className="preferences__language">
              <button
                onClick={() => {
                  setLanguage("pt")
                  localStorage.setItem("language", "pt")
                }}
                className="btn-flag"
              >
                <Flags.BR
                  title="Português"
                  className="btn-flag__flag"
                ></Flags.BR>
                <div className="btn-flag__text btn-flag__text--thick">
                  Português
                </div>
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
                className="btn-flag u-disabled-btn"
              >
                <Flags.ES title="Español" className="btn-flag__flag"></Flags.ES>
                <div className="btn-flag__text btn-flag__text--thick">
                  Español
                </div>
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
                className="btn-flag u-disabled-btn"
              >
                <Flags.GB title="English" className="btn-flag__flag"></Flags.GB>
                <div className="btn-flag__text btn-flag__text--thick">
                  English
                </div>
                {language === "en" ? (
                  <div className="btn-flag__active">
                    <FaCheck />
                  </div>
                ) : null}
              </button>
            </div>
          </div>
          <div className="settings__menu-item">
            <div className="preferences__heading">Modo</div>
          </div>
          <div className="settings__menu-item">
            <div className="preferences__theme">
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
                <div className="btn-color-circle-icon__text btn-color-circle-icon__text--thick">
                  Dark
                </div>
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
                <div className="btn-color-circle-icon__text btn-color-circle-icon__text--thick">
                  Light
                </div>
              </button>
            </div>
          </div>
          <div className="settings__menu-item">
            <div className="settings__menu-footer">
              <button className="btn-primary btn-primary--w100 btn-primary--color-primary u-disabled-btn">
                <div className="btn-primary--text">Personalizar o feed</div>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="settings__footer">
        {location && location.state && location.state.user ? (
          <ProfileBottombar />
        ) : (
          <DefaultBottombar />
        )}
      </div>
    </>
  )
}

export default scrollToTop({ component: Preferences })
