import React, { useRef } from "react"
import scrollToTop from "../../components/scrollToTop"
import {
  BiWinkSmile,
  AiOutlineCompass,
  BiBookHeart,
  FiArrowDownCircle,
  AiOutlineCode,
  AiOutlineShareAlt,
  AiOutlineCopyright,
  FiArrowUpCircle,
  FiTwitter,
  FiInstagram,
} from "react-icons/all"
import Image from "../../components/image"

import DefaultBottombar from "../../components/defaultBottombar"

import Turi from "../../assets/turi_pic.jpg"
import Mafe from "../../assets/mafe_pic.jpg"
import Arthur from "../../assets/arthur_pic.jpg"

function About() {
  const pageStart = useRef()
  const aboutDescription = useRef()

  return (
    <div ref={pageStart} className="about">
      <div className="text-header text-header--bottombar">
        <div className="text-header__heading">
          <div className="text-header__heading--secondary">No LangLev</div>
          <div className="text-header__heading--primary">
            você aprende outros idiomas de uma forma divertida!
          </div>
        </div>
        <button
          onClick={() => {
            aboutDescription.current.scrollIntoView({
              behavior: "smooth",
            })
          }}
          className="text-header__scroll-down-btn"
        >
          <FiArrowDownCircle />
        </button>
      </div>
      <div ref={aboutDescription} className="about__description">
        <div className="cool-heading">Quem Somos</div>
        <p className="about__description-paragraph">
          <span className="about__description-paragraph--bold">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Hic earum
            vel ratione velit laboriosam, omnis vitae ad.
          </span>
          &nbsp;Animi at et est voluptatem perferendis aperiam voluptates
          dolorum officiis adipisci tempora, repudiandae cumque.
        </p>
        <p className="about__description-paragraph">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta,
          vitae?.&nbsp;
          <span className="about__description-paragraph--bold">
            Cupiditate culpa, ad deleniti a laborum libero ipsum. Dolorem maxime
            fugit enim voluptate vitae soluta atque modi illo exercitationem.
          </span>
        </p>
      </div>
      <div className="about__values">
        <div className="about__values-heading">
          Nossos&nbsp;
          <span className="about__values-heading--strike">Valores</span>
        </div>
        <div className="about__values-content">
          <div className="about__values-item">
            <BiBookHeart className="about__values-item--icon" />
            <div className="about__values-item--heading">
              O gosto pela educação
            </div>
            <div className="about__values-item--text">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Doloribus, perspiciatis maiores exercitationem deleniti quo quod.
            </div>
          </div>
          <div className="about__values-item">
            <AiOutlineCompass className="about__values-item--icon" />
            <div className="about__values-item--heading">
              Comunicação sem fronteiras
            </div>
            <div className="about__values-item--text">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Autem
              deleniti id, repellendus sequi tempore odit.
            </div>
          </div>
          <div className="about__values-item">
            <BiWinkSmile className="about__values-item--icon" />
            <div className="about__values-item--heading">
              Aprendizado pelo humor
            </div>
            <div className="about__values-item--text">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit.
              Excepturi eaque non assumenda eveniet inventore optio!
            </div>
          </div>
        </div>
      </div>
      <div className="about__members">
        <div className="cool-heading about__members--heading u-margin-bottom-big">
          Conheça os linguarudos
        </div>
        <div className="about__members-grid">
          <div className="team-card">
            <Image
              containerClass="team-card__picture"
              src={Arthur}
              alt="Arthur"
            />
            <div className="team-card__caption">
              <AiOutlineCopyright className="team-card__caption--icon" />
              <div className="team-card__caption--text">
                <span className="team-card__caption--name">
                  Arthur Siqueira
                </span>
                &nbsp;dolor sit amet consectetur adipisicing.
              </div>
            </div>
          </div>
          <div className="team-card">
            <Image containerClass="team-card__picture" src={Turi} alt="Turi" />
            <div className="team-card__caption">
              <AiOutlineCode className="team-card__caption--icon" />
              <div className="team-card__caption--text">
                <span className="team-card__caption--name">Turi Andrade</span>
                &nbsp;dolor sit amet consectetur adipisicing.
              </div>
            </div>
          </div>
          <div className="team-card">
            <Image containerClass="team-card__picture" src={Mafe} alt="Mafê" />
            <div className="team-card__caption">
              <AiOutlineShareAlt className="team-card__caption--icon" />
              <div className="team-card__caption--text">
                <span className="team-card__caption--name">
                  Maria Fernanda Bastos
                </span>
                &nbsp;dolor sit amet consectetur adipisicing.
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="footer footer--bottombar">
        <button
          onClick={() => {
            pageStart.current.scrollIntoView({
              behavior: "smooth",
            })
          }}
          className="footer__scroll-up-btn"
        >
          <FiArrowUpCircle />
        </button>
        <div className="footer__heading">
          <span className="footer__heading--1">Language</span>
          <span className="footer__heading--2">Leverage</span>
        </div>
        <form className="footer__form">
          <div className="footer__form--heading">
            Se inscreva para receber toda semana nossa newsletter e se divertir
            enquanto aprende inglês!
          </div>
          <input type="text" placeholder="Nome" />
          <input type="text" placeholder="Email" />
          <button type="submit">Inscreva-se</button>
        </form>
        <div className="footer__bottom">
          <a
            href="https://twitter.com/"
            className="footer__social-link u-disabled-btn"
          >
            <FiTwitter />
          </a>
          <a
            href="https://www.instagram.com/langlevbrasil/"
            className="footer__social-link"
          >
            <FiInstagram />
          </a>
        </div>
      </div>
      <div className="about__bottombar">
        <DefaultBottombar fullBorder />
      </div>
    </div>
  )
}

export default scrollToTop({ component: About })
