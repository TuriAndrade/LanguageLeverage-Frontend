import React, { useState } from "react"
import Comment from "../comment"
import {
  AiOutlineHeart,
  AiOutlineShareAlt,
  AiOutlinePlusCircle,
  AiOutlineMinusCircle,
  GoComment,
} from "react-icons/all"
import getTimePassed from "../../utils/getTimePassed"
import DefaultProfilePicture from "../../assets/default-profile-picture.png"

export default function Post({ article, fowardedRef }) {
  const [isOpened, setIsOpened] = useState(false)

  function convertTime(timestamp) {
    const time = getTimePassed(timestamp)

    if (!time) {
      return "Data não encontrada!"
    } else {
      return `${time.n}${time.unit}`
    }
  }

  return (
    <div ref={fowardedRef} className="post-box">
      <div className="post-header">
        <div className="post-header__header">
          <div className="post-header__profile-picture">
            <img
              src={
                (article.Editor &&
                  article.Editor.User &&
                  article.Editor.User.picture) ||
                DefaultProfilePicture
              }
              alt="EditorPic"
            />
          </div>
          <div className="post-header__login">
            <div className="post-header__login--text">
              {article.Editor.User.login}
            </div>
          </div>
          <div className="post-header__publish-time">
            {convertTime(new Date(article.createdAt).getTime())}
          </div>
        </div>
        <div className="post-header__cover">
          <img src={article.cover} alt="Capa" />
        </div>
        <div className="post-header__btn-box">
          <div className="post-header__btn">
            <button className="btn-icon btn-icon--orange">
              <div className="btn-icon--icon">
                <GoComment />
              </div>
              <div className="btn-icon--number post-header__btn-number">7</div>
            </button>
          </div>
          <div className="post-header__btn">
            <button className="btn-icon btn-icon--red">
              <div className="btn-icon--icon">
                <AiOutlineHeart />
              </div>
              <div className="btn-icon--number post-header__btn-number">64</div>
            </button>
          </div>
          <div className="post-header__btn">
            <button className="btn-icon btn-icon--primary">
              <div className="btn-icon--icon">
                <AiOutlineShareAlt />
              </div>
            </button>
          </div>
          <div className="post-header__btn">
            <button
              onClick={() => setIsOpened((prevState) => !prevState)}
              className="btn-icon btn-icon--green"
            >
              <div className="btn-icon--icon">
                {isOpened ? <AiOutlineMinusCircle /> : <AiOutlinePlusCircle />}
              </div>
            </button>
          </div>
        </div>
      </div>
      <div
        className={
          isOpened
            ? "post-content post-content--opened"
            : "post-content post-content--closed"
        }
      >
        <div
          dangerouslySetInnerHTML={{ __html: article.html }}
          className="post-content__content-box"
        ></div>
        {article.Subjects && article.Subjects.length > 0 && (
          <div className="post-content__categories-box">
            {article.Subjects.map((category, index) => {
              if (category.subject) {
                return (
                  <div key={index} className="post-content__category">
                    {category.subject}
                  </div>
                )
              } else return null
            })}
          </div>
        )}
        <div className="post-content__comments-box">
          <div className="post-content__comments-header">4 Comentários</div>
          <input
            placeholder="Comente aqui"
            className="post-content__comments-input"
          ></input>
          <div className="post-content__comments">
            <Comment />
            <Comment replyTo={1} />
            <Comment />
            <Comment />
            <Comment replyTo={3} />
            <Comment replyTo={3} />
            <Comment replyTo={3} />
            <Comment />
          </div>
        </div>
      </div>
    </div>
  )
}
