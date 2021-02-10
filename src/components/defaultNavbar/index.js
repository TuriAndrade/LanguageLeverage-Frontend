import React, { useState, useContext } from "react"
import Logo from "../../assets/Logo.png"
import { CSSTransition } from "react-transition-group"
import { LanguageContext } from "../../components/context"
import { UserContext } from "../../components/context"
import { HiddenSidebarContext } from "../defaultHiddenSidebar/context"
import { CgProfile, FiSearch } from "react-icons/all"
import UseAnimation from "react-useanimations"
import loading from "react-useanimations/lib/loading"
import { Link, useHistory } from "react-router-dom"
import { FiltersContext } from "../context"
import { atMost50 } from "../../validators/general"
import Flags from "country-flag-icons/react/3x2"

export default function DefaultNavbar() {
  const [searchbarIn, setSearchbarIn] = useState(false)
  const { language } = useContext(LanguageContext)
  const { user } = useContext(UserContext)
  const [category, setCategory] = useState("")
  const { sidebarIn, setSidebarIn } = useContext(HiddenSidebarContext)
  const { setFilters } = useContext(FiltersContext)

  const history = useHistory()

  return (
    <div className="navbar">
      <div className="navbar__menu-box">
        {user && user.loading ? (
          <UseAnimation
            className="navbar__profile-btn-box"
            wrapperStyle={{ width: "3rem", height: "3rem" }}
            animation={loading}
            strokeColor="#0092db"
          />
        ) : user ? (
          <Link to="/profile" className="btn-icon navbar__profile-btn-box">
            <div className="btn-icon--icon">
              <CgProfile />
            </div>
          </Link>
        ) : (
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
        )}
        <Link to="/" className="navbar__logo">
          <img src={Logo} alt="Logo" />
        </Link>
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

              history.push("/")
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
        <div className="btn-flag">
          {language === "pt" ? (
            <Flags.BR title="Português" className="btn-flag__flag"></Flags.BR>
          ) : language === "en" ? (
            <Flags.GB title="English" className="btn-flag__flag"></Flags.GB>
          ) : language === "es" ? (
            <Flags.ES title="Español" className="btn-flag__flag"></Flags.ES>
          ) : null}
        </div>
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
