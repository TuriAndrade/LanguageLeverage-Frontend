import React, { useState, useContext, useEffect } from "react"
import { CSSTransition } from "react-transition-group"
import BrazilIcon from "../../assets/Icons/icon-brazil-flag.png"
import SapinlIcon from "../../assets/Icons/icon-spain-flag.png"
import UkIcon from "../../assets/Icons/icon-uk-flag.png"
import {
  FaCheck,
  FaTimes,
  FaPlusCircle,
  AiOutlineUser,
  RiHomeLine,
  MdTrendingUp,
  RiSettingsLine,
  BsInfoCircle,
  BsGrid3X3Gap,
} from "react-icons/all"
import { ThemeContext, LanguageContext, FiltersContext } from "../context"
import { Link, useRouteMatch } from "react-router-dom"
import api from "../../services/api"
import UseAnimation from "react-useanimations"
import loading from "react-useanimations/lib/loading"

export default function DefaultSidebarLeft() {
  const { theme, setTheme } = useContext(ThemeContext)
  const { language, setLanguage } = useContext(LanguageContext)
  const { filters, setFilters } = useContext(FiltersContext)

  const [categoriesIn, setCategoriesIn] = useState(false)
  const [optionsIn, setOptionsIn] = useState(false)

  const [categories, setCategories] = useState([])
  const [chooseCategories, setChooseCategories] = useState([])
  const [errorCategories, setErrorCategories] = useState(null)
  const [loadingCategories, setLoadingCategories] = useState(true)

  useEffect(() => {
    api
      .post("/get/subjects")
      .then((response) => {
        const subjects = response.data.subjects

        setCategories((prevSubjects) => {
          setChooseCategories((prevChosen) => {
            return [...prevChosen, ...subjects.map(() => false)]
          })
          return [...prevSubjects, ...subjects]
        })
      })
      .catch((e) => setErrorCategories("Algum erro ocorreu!"))
      .finally(() => setLoadingCategories(false))
  }, [])

  const home = useRouteMatch({
    path: "/",
    exact: true,
  })

  const trending = useRouteMatch({
    path: "/trending",
  })

  const about = useRouteMatch({
    path: "/about",
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
            to="/trending"
            className={
              trending
                ? "sidebar__menu-item sidebar__menu-item--active"
                : "sidebar__menu-item"
            }
          >
            <div className="sidebar__menu-icon">
              <MdTrendingUp />
            </div>
            <div className="sidebar__menu-text">Trending</div>
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
                setCategoriesIn(false)
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
        <div className="sidebar__menu-item-box">
          <Link
            to="/about"
            className={
              about
                ? "sidebar__menu-item sidebar__menu-item--active"
                : "sidebar__menu-item"
            }
          >
            <div className="sidebar__menu-icon">
              <BsInfoCircle />
            </div>
            <div className="sidebar__menu-text">Sobre</div>
          </Link>
        </div>
        <div className="sidebar__menu-item-box">
          <CSSTransition
            in={categoriesIn}
            classNames="sidebar__menu-item-expand-box"
            timeout={250}
            unmountOnExit
          >
            <div className="sidebar__menu-item-expand-box">
              <div
                className={
                  errorCategories
                    ? "sidebar__menu-categories-box sidebar__menu-categories-box--error"
                    : "sidebar__menu-categories-box"
                }
              >
                {errorCategories ? (
                  <p>{errorCategories}</p>
                ) : loadingCategories ? (
                  <UseAnimation
                    wrapperStyle={{ width: "3rem", height: "3rem" }}
                    animation={loading}
                    strokeColor="#0092db"
                  />
                ) : (
                  <>
                    <div className="sidebar__menu-categories">
                      {categories.map((category, index) => {
                        return (
                          <div
                            key={index}
                            onClick={() => {
                              setChooseCategories((prevstate) =>
                                prevstate.map((entry, i) =>
                                  index === i ? true : entry
                                )
                              )
                              setFilters((prevstate) =>
                                prevstate.includes(category)
                                  ? prevstate.filter(
                                      (entry) => entry !== category
                                    )
                                  : [...prevstate, category]
                              )
                            }}
                            className={
                              filters.includes(category)
                                ? "sidebar__menu-category sidebar__menu-category--active"
                                : "sidebar__menu-category sidebar__menu-category--inactive"
                            }
                          >
                            {category}
                            <CSSTransition
                              in={chooseCategories[index]}
                              onEntered={() => {
                                setChooseCategories((prevstate) =>
                                  prevstate.map((entry, i) =>
                                    index === i ? false : entry
                                  )
                                )
                              }}
                              timeout={1000}
                              classNames="sidebar__menu-chosen-category"
                              unmountOnExit
                            >
                              <div
                                className={
                                  filters.includes(category)
                                    ? "sidebar__menu-chosen-category sidebar__menu-chosen-category--add"
                                    : "sidebar__menu-chosen-category sidebar__menu-chosen-category--remove"
                                }
                              >
                                {filters.includes(category) ? (
                                  <FaCheck />
                                ) : (
                                  <FaTimes />
                                )}
                              </div>
                            </CSSTransition>
                          </div>
                        )
                      })}
                    </div>
                    <Link
                      to="/categories"
                      className="sidebar__menu-categories-btn"
                    >
                      <FaPlusCircle />
                    </Link>
                  </>
                )}
              </div>
            </div>
          </CSSTransition>
          <CSSTransition
            in={categoriesIn}
            classNames="sidebar__menu-item"
            timeout={250}
          >
            <button
              onClick={() => {
                setCategoriesIn((prevState) => !prevState)
                setOptionsIn(false)
              }}
              className="sidebar__menu-item"
            >
              <div className="sidebar__menu-icon">
                <BsGrid3X3Gap />
              </div>
              <div className="sidebar__menu-text">Categorias</div>
            </button>
          </CSSTransition>
        </div>
        <div className="sidebar__menu-item-box">
          <Link to="/register" className="sidebar__menu-item">
            <div className="sidebar__menu-icon">
              <AiOutlineUser />
            </div>
            <div className="sidebar__menu-text">Cadastro</div>
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
