import React from "react"
import { FiTwitter, FiInstagram, FiFacebook, FaWhatsapp } from "react-icons/all"

export default function DefaultSidebarRight() {
  return (
    <div className="sidebar">
      <div className="sidebar__advertisement-box sidebar__advertisement-box--small">
        <div className="sidebar__no-ads-message">
          Nenhum anúncio no momento!
        </div>
      </div>
      <div className="sidebar__advertisement-box sidebar__advertisement-box--big">
        <div className="sidebar__no-ads-message">
          Nenhum anúncio no momento!
        </div>
      </div>
      <div className="sidebar__social-media-box">
        <div className="sidebar__social-media-header">
          <span className="sidebar__social-media-header--secondary">
            Follow&nbsp;
          </span>
          <span className="sidebar__social-media-header--primary">LangLev</span>
        </div>
        <div className="sidebar__social-media-icon-box">
          <a
            href="https://twitter.com/langlevbrasil/"
            className="sidebar__social-media-icon"
          >
            <FiTwitter />
          </a>
        </div>
        <div className="sidebar__social-media-icon-box">
          <a
            href="https://www.instagram.com/langlevbrasil/"
            className="sidebar__social-media-icon"
          >
            <FiInstagram />
          </a>
        </div>
        <div className="sidebar__social-media-icon-box">
          <a
            href="https://www.facebook.com/LangLev-Language-Leverage-106112188113886/"
            className="sidebar__social-media-icon"
          >
            <FiFacebook />
          </a>
        </div>
        <div className="sidebar__social-media-icon-box">
          <a
            href="https://chat.whatsapp.com/IQKtksqGJOBIpOpIsQ7gvL/"
            className="sidebar__social-media-icon"
          >
            <FaWhatsapp />
          </a>
        </div>
      </div>
    </div>
  )
}
