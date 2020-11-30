import React, { useEffect, useState } from "react"
import scrollToTop from "../../components/scrollToTop"
import ProfileCard from "../../components/profileCard"
import LoadingContent from "../../components/loadingContent"
import api from "../../services/api"
import PopupMessage from "../../components/popupMessage"

function Editors() {
  const [editors, setEditors] = useState(null)
  const [filter, setFilter] = useState("validated")
  const [loadingContent, setLoadingContent] = useState(true)

  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const [popupIn, setPopupIn] = useState(false)

  useEffect(() => {
    api
      .get("/editors", { withCredentials: true })
      .then((response) => {
        if (response.data.editors) {
          setEditors(response.data.editors)
        }

        setLoadingContent(false)
      })
      .catch((e) => {
        setError("Algo de errado aconteceu!")
        setPopupIn(true)
        setLoadingContent(false)
      })
  }, [])

  function toggleValidateEditor(id) {
    setEditors((prevstate) =>
      Array.isArray(prevstate)
        ? prevstate.map((entry) => {
            if (entry.id === id) {
              return {
                ...entry,
                isValidated: !entry.isValidated,
              }
            } else {
              return entry
            }
          })
        : prevstate
    )
  }

  function removeEditor(id) {
    setEditors((prevstate) =>
      Array.isArray(prevstate)
        ? prevstate.filter((entry) => entry.id !== id)
        : null
    )
  }

  function getEditors() {
    const validated =
      Array.isArray(editors) && editors.filter((editor) => !!editor.isValidated)
    const invalidated =
      Array.isArray(editors) && editors.filter((editor) => !editor.isValidated)

    if (filter === "validated") {
      if (!Array.isArray(validated) || (validated && validated.length === 0)) {
        return (
          <div className="dashboard__item dashboard__item--min-content u-no-transitions dashboard__item--warning u-discreet-disabled-btn">
            Nenhum editor validado!
          </div>
        )
      } else {
        return (
          <div className="users">
            {validated.map((editor) => {
              return (
                <ProfileCard
                  key={editor.id}
                  editor={editor}
                  user={editor.User}
                  toggleValidate={toggleValidateEditor}
                  remove={removeEditor}
                  setError={setError}
                  setSuccess={setSuccess}
                  setPopupIn={setPopupIn}
                />
              )
            })}
          </div>
        )
      }
    } else {
      if (
        !Array.isArray(invalidated) ||
        (invalidated && invalidated.length === 0)
      ) {
        return (
          <div className="dashboard__item dashboard__item--min-content u-no-transitions dashboard__item--warning u-discreet-disabled-btn">
            Nenhum editor invalidado!
          </div>
        )
      } else {
        return (
          <div className="users">
            {invalidated.map((editor) => {
              return (
                <ProfileCard
                  key={editor.id}
                  editor={editor}
                  user={editor.User}
                  toggleValidate={toggleValidateEditor}
                  remove={removeEditor}
                  setError={setError}
                  setSuccess={setSuccess}
                  setPopupIn={setPopupIn}
                />
              )
            })}
          </div>
        )
      }
    }
  }

  return (
    <>
      <PopupMessage
        modalIn={popupIn}
        setModalIn={setPopupIn}
        error={error}
        setError={setError}
        sucess={success}
        setSuccess={setSuccess}
      />
      <LoadingContent loadingIn={loadingContent} />
      {!loadingContent ? (
        <div className="dashboard dashboard--header dashboard--min-content">
          <div className="dashboard__header">
            <button
              onClick={() => setFilter("validated")}
              className={
                filter === "validated"
                  ? "dashboard__header-option dashboard__header-option--active"
                  : "dashboard__header-option"
              }
            >
              Validados
            </button>
            <button
              onClick={() => setFilter("invalidated")}
              className={
                filter === "invalidated"
                  ? "dashboard__header-option dashboard__header-option--active"
                  : "dashboard__header-option"
              }
            >
              Invalidados
            </button>
          </div>
          {getEditors()}
        </div>
      ) : null}
    </>
  )
}

export default scrollToTop({ component: Editors })
