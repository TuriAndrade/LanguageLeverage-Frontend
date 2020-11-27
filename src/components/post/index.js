import React, { useState } from "react"
import Meme from "../../assets/meme_static.webp"
import Comment from "../comment"
import {
  AiOutlineHeart,
  AiOutlineShareAlt,
  AiOutlinePlusCircle,
  AiOutlineMinusCircle,
  GoComment,
} from "react-icons/all"

export default function Post() {
  const [isOpened, setIsOpened] = useState(false)

  return (
    <div className="post-box">
      <div className="post-header">
        <div className="post-header__header">
          <div className="post-header__profile-picture"></div>
          <div className="post-header__title">titulo do post</div>
          <div className="post-header__publish-time"> 7h</div>
        </div>
        <div className="post-header__cover">
          <img src={Meme} alt="Meme" />
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
        <div className="post-content__content-box">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus
          alias quia, deleniti nulla voluptatibus animi necessitatibus provident
          doloribus labore quos culpa. Incidunt inventore doloremque dolores
          esse eveniet quae perferendis amet ducimus, saepe dignissimos dolorem
          earum at nesciunt ab commodi minima deleniti officia cumque obcaecati
          aliquid similique. Tenetur ratione dolor placeat? Distinctio, suscipit
          exercitationem fuga enim quisquam adipisci recusandae velit
          accusantium dolorum. Autem labore, minus maxime magnam quidem fugiat.
          Id dolore aliquid iure est dignissimos aut officia quam nihil iste
          sed. Voluptatem atque consequuntur ipsam id aperiam iusto at, fugiat
          illum, quo ducimus repudiandae deserunt expedita eius ab possimus
          distinctio non.
        </div>
        <div className="post-content__categories-box">
          <div className="post-content__category">Art</div>
          <div className="post-content__category">Politcs</div>
          <div className="post-content__category">Cringe</div>
          <div className="post-content__category">History</div>
          <div className="post-content__category">Animals</div>
          <div className="post-content__category">Programming</div>
          <div className="post-content__category">Good Vibes</div>
          <div className="post-content__category">Shitpost</div>
        </div>
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
