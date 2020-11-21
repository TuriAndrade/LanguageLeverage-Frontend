import React from "react"
import { FaArrowLeft } from "react-icons/all"
import { Link } from "react-router-dom"
import DefaultBottombar from "../../components/defaultBottombar"
import scrollToTop from "../../components/scrollToTop"

function Categories({ location }) {
  return (
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
            <p>Categorias</p>
          </div>
        </div>
        <div className="settings__menu-item">
          <div className="categories__box">
            <div className="categories__item">Animais</div>
            <div className="categories__item">Cringe</div>
            <div className="categories__item">Shitpost</div>
            <div className="categories__item">Cult</div>
            <div className="categories__item">Art</div>
            <div className="categories__item">Animais</div>
            <div className="categories__item">Cringe</div>
            <div className="categories__item">Shitpost</div>
            <div className="categories__item">Cult</div>
            <div className="categories__item">Art</div>
            <div className="categories__item">Animais</div>
            <div className="categories__item">Cringe</div>
            <div className="categories__item">Shitpost</div>
            <div className="categories__item">Cult</div>
            <div className="categories__item">Art</div>
            <div className="categories__item">Animais</div>
            <div className="categories__item">Cringe</div>
            <div className="categories__item">Shitpost</div>
            <div className="categories__item">Cult</div>
            <div className="categories__item">Art</div>
            <div className="categories__item">Animais</div>
            <div className="categories__item">Cringe</div>
            <div className="categories__item">Shitpost</div>
            <div className="categories__item">Cult</div>
            <div className="categories__item">Art</div>
          </div>
        </div>
      </div>
      <div className="settings__footer">
        <DefaultBottombar />
      </div>
    </div>
  )
}

export default scrollToTop({ component: Categories })
