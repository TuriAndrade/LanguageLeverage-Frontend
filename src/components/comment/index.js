import React, { useState } from "react"
import { CSSTransition } from "react-transition-group"

export default function Comment({ replyTo }) {
  const [replyInputIn, setReplyInputIn] = useState(false)

  return (
    <div
      className={replyTo ? "post-comment post-comment--reply" : "post-comment"}
    >
      <div className="post-comment__header">
        <div className="post-comment__header--primary">Ednaldo Pereira</div>
        <div className="post-comment__header--secondary">7h</div>
        <div
          onClick={() => setReplyInputIn((prevState) => !prevState)}
          className="post-comment__reply-btn"
        >
          {replyInputIn ? "Close" : "Reply"}
        </div>
      </div>
      <div className="post-comment__text">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid earum
        debitis placeat saepe repellendus nam omnis ipsum, sed sunt qui!
      </div>
      <CSSTransition
        in={replyInputIn}
        timeout={2000}
        classNames="post-comment__reply-input"
        unmountOnExit
      >
        <input
          placeholder="Comente aqui"
          className="post-comment__reply-input"
        ></input>
      </CSSTransition>
    </div>
  )
}
