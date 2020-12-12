import React, { useContext } from "react"
import Logo from "../../assets/Logo.png"
import { CgProfile } from "react-icons/cg"
import { LanguageContext } from "../context"
import { Link } from "react-router-dom"
import Flags from "country-flag-icons/react/3x2"

export default function ProfileNavbar() {
  const { language } = useContext(LanguageContext)

  return (
    <div className="navbar">
      <div className="navbar__menu-box navbar__menu-box--profile">
        <img src={Logo} alt="Logo" className="navbar__logo" />
      </div>
      <div className="navbar__profile-box">
        <Link to="/profile" className="btn-icon">
          <div className="btn-icon--icon">
            <CgProfile />
          </div>
        </Link>
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
        <Link to="/profile" className="btn-icon">
          <div className="btn-icon--icon">
            <CgProfile />
          </div>
        </Link>
      </div>
    </div>
  )
}
