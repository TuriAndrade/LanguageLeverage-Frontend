import React from "react"
import {
  FiClock,
  FiTrash2,
  HiOutlineLocationMarker,
  MdDevices,
} from "react-icons/all"

export default function DashboardPost() {
  return (
    <div className="dashboard__item">
      <div className="dashboard__item-section">
        <div className="dashboard__item-section--secondary">
          <HiOutlineLocationMarker />
          &nbsp;&nbsp; Conselheiro Lafaiete
        </div>
        <div className="dashboard__item-section--tertiary">
          <FiClock />
          &nbsp;&nbsp; 3 days ago
        </div>
        <div className="dashboard__item-section--tertiary dashboard__item-section--phone">
          <MdDevices />
          &nbsp;&nbsp;Celular
        </div>
      </div>
      <div className="dashboard__item-section dashboard__item-section--normal">
        <div className="dashboard__item-section--tertiary">
          <MdDevices />
          &nbsp;&nbsp;Celular
        </div>
      </div>
      <div className="dashboard__item-section">
        <button className="btn-icon-3 btn-icon-3--red">
          <FiTrash2 />
        </button>
      </div>
    </div>
  )
}
