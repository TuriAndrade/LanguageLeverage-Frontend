import React, { useContext } from "react"
import Logo from "../../assets/Logo.png"
import BrazilIcon from "../../assets/Icons/icon-brazil-flag.png"
import SapinlIcon from "../../assets/Icons/icon-spain-flag.png"
import UkIcon from "../../assets/Icons/icon-uk-flag.png"
import { CgProfile } from "react-icons/cg"
import { LanguageContext } from "../context"
import { Link } from "react-router-dom"

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
        <Link to="/profile" className="btn-icon">
          <div className="btn-icon--icon">
            <CgProfile />
          </div>
        </Link>
      </div>
    </div>
  )
}
