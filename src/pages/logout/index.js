import React from "react"
import DashboardSession from "../../components/dashboardSession"
import scrollToTop from "../../components/scrollToTop"
import { FiTrash2 } from "react-icons/all"

function Logout() {
  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <button className="dashboard__header-option dashboard__header-option--active">
          Todas as sessões
        </button>
        <button className="dashboard__header-option">Essa sessão</button>
      </div>
      <DashboardSession />
      <DashboardSession />
      <DashboardSession />
      <DashboardSession />
      <DashboardSession />
      <DashboardSession />
      <DashboardSession />
      <DashboardSession />
      <DashboardSession />
      <DashboardSession />
      <DashboardSession />
      <DashboardSession />
      <button className="dashboard__item dashboard__item--message dashboard__item--red">
        <FiTrash2 />
        &nbsp;&nbsp; Sair de todas as sessões
      </button>
    </div>
  )
}

export default scrollToTop({ component: Logout })
