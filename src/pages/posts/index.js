import React from "react"
import DashboardPost from "../../components/dashboardPost"
import scrollToTop from "../../components/scrollToTop"

function Posts() {
  return (
    <div className="dashboard dashboard--header">
      <div className="dashboard__header">
        <button className="dashboard__header-option dashboard__header-option--active">
          Publicados
        </button>
        <button className="dashboard__header-option">Rascunhos</button>
        <button className="dashboard__header-option">Sugestões</button>
      </div>
      <DashboardPost />
      <DashboardPost />
      <DashboardPost />
      <DashboardPost />
      <DashboardPost />
      <DashboardPost />
      <DashboardPost />
      <DashboardPost />
      <DashboardPost />
      <DashboardPost />
      <DashboardPost />
    </div>
  )
}

export default scrollToTop({ component: Posts })
