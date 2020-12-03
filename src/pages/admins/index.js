import React, { useEffect, useState } from "react"
import scrollToTop from "../../components/scrollToTop"
import ProfileCard from "../../components/profileCard"
import LoadingContent from "../../components/loadingContent"
import api from "../../services/api"
import PopupMessage from "../../components/popupMessage"

function Admins() {
  const [admins, setAdmins] = useState([])
  const [filter, setFilter] = useState("full")
  const [loadingContent, setLoadingContent] = useState(true)

  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const [popupIn, setPopupIn] = useState(false)

  useEffect(() => {
    api
      .get("/admins", { withCredentials: true })
      .then((response) => {
        const admins = response.data.admins

        setAdmins(admins)

        setLoadingContent(false)
      })
      .catch((e) => {
        setError("Algo de errado aconteceu!")
        setPopupIn(true)
        setLoadingContent(false)
      })
  }, [])

  function grantFullPermission(id) {
    setAdmins((prevstate) =>
      prevstate.map((entry) => {
        if (entry.id === id) {
          return {
            ...entry,
            hasFullPermission: true,
          }
        } else {
          return entry
        }
      })
    )
  }

  function removeAdmin(id) {
    setAdmins((prevstate) => prevstate.filter((entry) => entry.id !== id))
  }

  function getAdmins() {
    const full = admins.filter((admin) => !!admin.hasFullPermission)
    const notFull = admins.filter((admin) => !admin.hasFullPermission)

    if (filter === "full") {
      if (full.length === 0) {
        return (
          <div className="dashboard__item dashboard__item--min-content u-no-transitions dashboard__item--warning u-discreet-disabled-btn">
            Nenhum admin pleno!
          </div>
        )
      } else {
        return (
          <div className="users">
            {full.map((admin) => {
              return (
                <ProfileCard
                  key={admin.id}
                  admin={admin}
                  user={admin.User}
                  remove={removeAdmin}
                  grantFullPermission={grantFullPermission}
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
      if (notFull.length === 0) {
        return (
          <div className="dashboard__item dashboard__item--min-content u-no-transitions dashboard__item--warning u-discreet-disabled-btn">
            Nenhum admin não pleno!
          </div>
        )
      } else {
        return (
          <div className="users">
            {notFull.map((admin) => {
              return (
                <ProfileCard
                  key={admin.id}
                  admin={admin}
                  user={admin.User}
                  remove={removeAdmin}
                  grantFullPermission={grantFullPermission}
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
              onClick={() => setFilter("full")}
              className={
                filter === "full"
                  ? "dashboard__header-option dashboard__header-option--active"
                  : "dashboard__header-option"
              }
            >
              Plenos
            </button>
            <button
              onClick={() => setFilter("notFull")}
              className={
                filter === "notFull"
                  ? "dashboard__header-option dashboard__header-option--active"
                  : "dashboard__header-option"
              }
            >
              Não plenos
            </button>
          </div>
          {getAdmins()}
        </div>
      ) : null}
    </>
  )
}

export default scrollToTop({ component: Admins })
