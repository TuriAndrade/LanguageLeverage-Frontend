import React, { useState, useContext } from "react"
import Logo from "../../assets/Logo.png"
import { CSSTransition } from "react-transition-group"
import BrazilIcon from "../../assets/Icons/icon-brazil-flag.png"
import SapinlIcon from "../../assets/Icons/icon-spain-flag.png"
import UkIcon from "../../assets/Icons/icon-uk-flag.png"
import { LanguageContext } from "../../components/context"
import { UserContext } from "../../components/context"
import { HiddenSidebarContext } from "../defaultHiddenSidebar/context"
import { CgProfile, FiSearch } from "react-icons/all"
import UseAnimation from "react-useanimations"
import loading from "react-useanimations/lib/loading"
import { Link } from "react-router-dom"
import { FiltersContext } from "../context"
import { atMost50 } from "../../validators/general"

export default function DefaultNavbar() {
  const [searchbarIn, setSearchbarIn] = useState(false)
  const { language } = useContext(LanguageContext)
  const { user } = useContext(UserContext)
  const [category, setCategory] = useState("")
  const { sidebarIn, setSidebarIn } = useContext(HiddenSidebarContext)
  const { setFilters } = useContext(FiltersContext)

  return (
    <div className="navbar">
      <div className="navbar__menu-box">
        <button
          onClick={() => setSidebarIn((prevState) => !prevState)}
          className="navbar__menu-btn-box"
        >
          <CSSTransition
            in={sidebarIn}
            timeout={500}
            classNames="navbar__menu-btn"
          >
            <div className="navbar__menu-btn"></div>
          </CSSTransition>
        </button>
        <img src={Logo} alt="Logo" className="navbar__logo" />
      </div>
      <div className="navbar__search-box">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (category) {
              setSearchbarIn(false)
              setCategory("")
              setFilters((prevstate) => {
                if (prevstate.includes(category)) return prevstate
                else return [...prevstate, category]
              })
            }
          }}
          className="navbar__search-form"
        >
          <CSSTransition
            in={searchbarIn}
            classNames="navbar__search-input"
            timeout={300}
            unmountOnExit
          >
            <input
              value={category}
              onChange={(e) => atMost50(e.target.value, setCategory)}
              className="navbar__search-input"
              type="text"
              placeholder="Pesquise no LangLev"
            />
          </CSSTransition>
          <button
            className={
              searchbarIn
                ? "navbar__search-btn navbar__search-btn--active"
                : "navbar__search-btn"
            }
            onClick={() => setSearchbarIn((prevState) => !prevState)}
            type="button"
          >
            <div className="navbar__search-icon">
              <FiSearch />
            </div>
          </button>
        </form>
      </div>
      <div className="navbar__btn-box">
        <button className="btn-flag">
          <img
            src={
              language === "pt"
                ? BrazilIcon
                : language === "en"
                ? UkIcon
                : SapinlIcon
            }
            alt="Language"
            className="btn-flag__flag"
          />
        </button>
        {user && user.loading ? (
          <UseAnimation
            wrapperStyle={{ width: "3rem", height: "3rem" }}
            animation={loading}
            strokeColor="#0092db"
          />
        ) : user ? (
          <Link to="/profile" className="btn-icon">
            <div className="btn-icon--icon">
              <CgProfile />
            </div>
          </Link>
        ) : (
          <Link to="/login" className="btn-text">
            Login
          </Link>
        )}
      </div>
    </div>
  )
}
