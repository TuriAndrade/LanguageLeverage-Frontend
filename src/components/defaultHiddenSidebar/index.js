import React, { useContext } from "react"
import { CSSTransition } from "react-transition-group"
import { HiddenSidebarContext } from "./context"
import { FiUserCheck, FiUserPlus, FiArrowRight } from "react-icons/all"
import { Link, useLocation } from "react-router-dom"

export default function DefaultHiddenSidebar() {
  const { sidebarIn, setSidebarIn } = useContext(HiddenSidebarContext)

  const location = useLocation()

  return (
    <CSSTransition
      in={sidebarIn}
      timeout={400}
      classNames="hidden-sidebar"
      unmountOnExit
    >
      <div className="hidden-sidebar">
        <div className="hidden-sidebar__header">
          <CSSTransition
            in={true} // true works because the parent of this Transition is being remounted on every enter
            classNames="hidden-sidebar__close-btn-box"
            appear
            timeout={800}
            unmountOnExit
          >
            <button
              onClick={() => {
                setSidebarIn((prevstate) => !prevstate)
              }}
              className="hidden-sidebar__close-btn-box"
            >
              <div className="hidden-sidebar__close-btn"></div>
            </button>
          </CSSTransition>
        </div>
        <Link
          onClick={() => {
            setSidebarIn((prevstate) => !prevstate)
          }}
          to={{
            pathname: "/login",
            state: {
              prevLocation: location.pathname,
            },
          }}
          className="hidden-sidebar__item hidden-sidebar__login-box"
        >
          <div className="hidden-sidebar__item--icon">
            <FiUserCheck />
          </div>
          <div className="hidden-sidebar__item--text-primary">Login</div>
          <div className="hidden-sidebar__item--text-secondary">
            Entre na plataforma!
          </div>
          <div className="hidden-sidebar__item-btn">
            <FiArrowRight />
          </div>
        </Link>
        <Link
          onClick={() => {
            setSidebarIn((prevstate) => !prevstate)
          }}
          to={{
            pathname: "/register",
            state: {
              prevLocation: location.pathname,
            },
          }}
          className="hidden-sidebar__item hidden-sidebar__register-box"
        >
          <div className="hidden-sidebar__item--icon">
            <FiUserPlus />
          </div>
          <div className="hidden-sidebar__item--text-primary">Cadastro</div>
          <div className="hidden-sidebar__item--text-secondary">
            Entre pro nosso time!
          </div>
          <div className="hidden-sidebar__item-btn">
            <FiArrowRight />
          </div>
        </Link>
      </div>
    </CSSTransition>
  )
}
