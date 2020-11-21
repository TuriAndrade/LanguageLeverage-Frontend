import React from "react"
import DashboardPost from "../../components/dashboardPost"
import scrollToTop from "../../components/scrollToTop"

function AllPosts() {
  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <button className="dashboard__header-option dashboard__header-option--active">
          Publicados
        </button>
        <button className="dashboard__header-option">Rascunhos</button>
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

export default scrollToTop({ component: AllPosts })
