import React from "react"
import { FiTwitter, FiInstagram } from "react-icons/all"

export default function DefaultSidebarRight() {
  return (
    <div className="sidebar">
      <div className="sidebar__advertisement-box sidebar__advertisement-box--small"></div>
      <div className="sidebar__advertisement-box sidebar__advertisement-box--big"></div>
      <div className="sidebar__social-media-box">
        <div className="sidebar__social-media-header">
          <span className="sidebar__social-media-header--secondary">
            Follow&nbsp;
          </span>
          <span className="sidebar__social-media-header--primary">LangLev</span>
        </div>
        <div className="sidebar__social-media-icon-box">
          <a href="https://twitter.com" className="sidebar__social-media-icon">
            <FiTwitter />
            {/*<span className="sidebar__social-media-icon--number">456</span>*/}
          </a>
        </div>
        <div className="sidebar__social-media-icon-box">
          <a
            href="https://www.instagram.com"
            className="sidebar__social-media-icon"
          >
            <FiInstagram />
            {/*<span className="sidebar__social-media-icon--number">855</span>*/}
          </a>
        </div>
      </div>
    </div>
  )
}
