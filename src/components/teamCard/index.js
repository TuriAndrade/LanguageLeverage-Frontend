import React, { useState } from "react"
import { CSSTransition } from "react-transition-group"
import Image from "../lazyImage"

export default function TeamCard({ name, caption, text, picture, alt, Icon }) {
  const [rotate, setRotate] = useState(false)

  return (
    <div
      className="team-card"
      onClick={() => setRotate((prevstate) => !prevstate)}
    >
      <CSSTransition in={rotate} timeout={400} classNames="team-card__picture">
        <Image containerClass="team-card__picture" src={picture} alt={alt} />
      </CSSTransition>
      <CSSTransition in={rotate} timeout={400} classNames="team-card__text">
        <div className="team-card__text">{`"${text}"`}</div>
      </CSSTransition>
      <div className="team-card__caption">
        <Icon className="team-card__caption--icon" />
        <div className="team-card__caption--text">
          <span className="team-card__caption--name">{name}</span>
          {", " + caption}
        </div>
      </div>
    </div>
  )
}
