import React, {
  useState,
  useContext,
  useCallback,
  useEffect,
  useRef,
} from "react"
import { FaArrowLeft, FaTimes, FaCheck } from "react-icons/all"
import { CSSTransition } from "react-transition-group"
import { Link } from "react-router-dom"
import DefaultBottombar from "../../components/defaultBottombar"
import scrollToTop from "../../components/scrollToTop"
import { FiltersContext } from "../../components/context"
import LoadingContent from "../../components/loadingContent"
import PopupMessage from "../../components/popupMessage"
import api from "../../services/api"
import UseAnimation from "react-useanimations"
import loading from "react-useanimations/lib/loading"

function Categories({ location }) {
  const { filters, setFilters } = useContext(FiltersContext)

  const [categories, setCategories] = useState([])
  const [chooseCategories, setChooseCategories] = useState([])
  const [error, setError] = useState(null)
  const [loadingContent, setLoadingContent] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [popupIn, setPopupIn] = useState(false)

  useEffect(() => {
    api
      .post("/get/subjects", { offset, limit: 30 })
      .then((response) => {
        const subjects = response.data.subjects

        setCategories((prevSubjects) => {
          setChooseCategories((prevChosen) => {
            return [...prevChosen, ...subjects.map(() => false)]
          })
          return [...prevSubjects, ...subjects]
        })

        setHasMore(subjects.length > 0)
      })
      .catch((e) => {
        setError("Algum erro aconteceu!")
        setPopupIn(true)
      })
      .finally(() => {
        setLoadingContent(false)
        setLoadingMore(false)
      })
  }, [offset])

  const observer = useRef()

  const lastCategory = useCallback(
    (node) => {
      if (loadingMore) return null

      if (observer.current) observer.current.disconnect()

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setOffset(categories.length)
          setLoadingMore(true)
        }
      })

      if (node) observer.current.observe(node)
    },
    [loadingMore, hasMore, categories]
  )

  return (
    <>
      <PopupMessage
        modalIn={popupIn}
        setModalIn={setPopupIn}
        error={error}
        setError={setError}
      />
      <LoadingContent loadingIn={loadingContent} />
      {!loadingContent ? (
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
                {categories.map((category, index) => {
                  return (
                    <div
                      ref={
                        index === categories.length - 1
                          ? lastCategory
                          : undefined
                      }
                      key={index}
                      onClick={() => {
                        setChooseCategories((prevstate) =>
                          prevstate.map((entry, i) =>
                            index === i ? true : entry
                          )
                        )
                        setFilters((prevstate) =>
                          prevstate.includes(category)
                            ? prevstate.filter((entry) => entry !== category)
                            : [...prevstate, category]
                        )
                      }}
                      className={
                        filters.includes(category)
                          ? "categories__item categories__item--active"
                          : "categories__item categories__item--inactive"
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
                        classNames="categories__chosen-item"
                        unmountOnExit
                      >
                        <div
                          className={
                            filters.includes(category)
                              ? "categories__chosen-item categories__chosen-item--add"
                              : "categories__chosen-item categories__chosen-item--remove"
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
            </div>
            <CSSTransition
              in={loadingMore}
              timeout={300}
              classNames="feed__loading"
              unmountOnExit
            >
              <div className="feed__loading">
                <UseAnimation
                  wrapperStyle={{ width: "4rem", height: "4rem" }}
                  animation={loading}
                  strokeColor="#0092db"
                />
              </div>
            </CSSTransition>
          </div>
        </div>
      ) : null}
      <div className="settings__footer">
        <DefaultBottombar />
      </div>
    </>
  )
}

export default scrollToTop({ component: Categories })
