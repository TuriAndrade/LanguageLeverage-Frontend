import React, { useRef, useState, useContext } from "react"
import scrollToTop from "../../components/scrollToTop"
import {
  BiWinkSmile,
  AiOutlineCompass,
  BiBookHeart,
  FiArrowDownCircle,
  AiOutlineCode,
  AiOutlineFileText,
  AiOutlineCopyright,
  AiOutlineAntDesign,
  AiOutlineShareAlt,
  AiOutlineAudio,
  FiArrowUpCircle,
  FiTwitter,
  FiInstagram,
  FiFacebook,
  RiAdvertisementLine,
  FaLanguage,
  FaWhatsapp,
} from "react-icons/all"

import DefaultBottombar from "../../components/defaultBottombar"
import TeamCard from "../../components/teamCard"
import PopupMessage from "../../components/popupMessage"
import ControlledInput from "../../components/controlledInput"

import Turi from "../../assets/turi_pic.jpg"
import Arthur from "../../assets/arthur_pic.jpg"
import Emy from "../../assets/emy_pic.png"
import Iago from "../../assets/iago_pic.png"
import Yasmin from "../../assets/yasmin_pic.png"
import AnaAlvim from "../../assets/ana_alvim_pic.png"
import PedroHenrique from "../../assets/pedro_henrique_pic.jpeg"
import Shara from "../../assets/shara_pic.png"
import Estelito from "../../assets/estelito_pic.png"
import Suziany from "../../assets/suziany_pic.png"
import Zach from "../../assets/zach_pic.png"
import Brandon from "../../assets/brandon_pic.png"
import Sam from "../../assets/sam_pic.png"
import SarahMarie from "../../assets/sarah_marie_pic.png"

import api from "../../services/api"

import { CsrfContext } from "../../components/context"

import { verifyIfBlank } from "../../validators/general"
import { validateEmail } from "../../validators/email"

function About() {
  const [name, setName] = useState("")
  const [errorName, setErrorName] = useState(null)
  const [email, setEmail] = useState("")
  const [errorEmail, setErrorEmail] = useState(null)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [popupIn, setPopupIn] = useState(false)

  const { csrfToken } = useContext(CsrfContext)

  const pageStart = useRef()
  const aboutDescription = useRef()

  async function subscribe(e) {
    e.preventDefault()
    const data = {
      name: verifyIfBlank(name, setErrorName),
      email: validateEmail(email, setErrorEmail),
    }

    if (data.name && data.email) {
      try {
        localStorage.setItem("name", data.name)
        localStorage.setItem("email", data.email)
        await api.post("/subscribe", data, {
          headers: {
            csrftoken: csrfToken,
          },
        })
        setError(false)
        setSuccess(true)
      } catch (e) {
        if (
          e.response &&
          e.response.data &&
          e.response.data.error === "You are already a subscriber!"
        ) {
          setError("Você já está inscrito na nossa newsletter!")
        } else {
          setError("Algum erro aconteceu!")
        }
        setSuccess(false)
      } finally {
        setPopupIn(true)
      }
    }
  }

  return (
    <>
      <PopupMessage
        modalIn={popupIn}
        setModalIn={setPopupIn}
        error={error}
        setError={setError}
        success={success}
        setSuccess={setSuccess}
      />
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
            <span className="about__description-paragraph--bold">LangLev</span>{" "}
            é um projeto voluntário que propõe o ensino de idiomas e cultura por
            meio de memes, a sensação humorística da nossa geração. O nome do
            projeto é uma abreviação de Language Leverage, do inglês, “alavanca
            linguística”. De fato, temos como objetivo alavancar os estudos de
            estudantes de todo o Brasil ao apresentar idiomas e cultura{" "}
            <span className="about__description-paragraph--bold">
              por meio de memes!
            </span>
          </p>
          <div className="cool-heading">Como Surgimos</div>
          <p className="about__description-paragraph">
            Tudo começou quando o estudante maranhense Arthur Melo dava aulas
            particulares de português para um estadunidense chamado Zach Byerly,
            atual membro da equipe como consultor de TI e narrador de áudios. Ao
            usar memes nas aulas online, Arthur viu uma oportunidade de
            dinamizar o aprendizado e, juntamente com Zach, começou a pensar em
            mais ideias de como construir uma plataforma de ensino interessante
            e inovadora, um sonho antigo de Arthur como aprendiz de idiomas. Não
            demorou muito até que Arthur recrutasse membros chave que se
            interessaram pela ideia do projeto desde o início. Turi Rezende foi
            recrutado como coordenador dos trabalhos de programação para criar a
            plataforma. Outras adições essenciais para o desenvolvimento das
            primeiras atividades da fundação do projeto foram: Emerson Aragão
            (conteúdo e redação), Iago Reis, Pedro Henrique, Maria Fernanda e
            Shara Hozanna (revisão e marketing). Davi Colares contribuiu com o
            design do site e a identidade visual do projeto. Os professores
            Estelito Neto e Suziany também se juntaram para ajudar com
            consultoria e na futura formalização do projeto em editais de
            extensão. De início, os membros assumem múltiplas tarefas a fim de
            cumprir com a demanda de atividades no funcionamento do projeto. Com
            o objetivo de trazer o humor como mecanismo de ensino, tentamos
            despertar mais motivação nos aprendizes de idiomas proporcionando
            uma comunidade na qual é possível aprender se divertindo.
          </p>
          <div className="cool-heading">Nossa Missão</div>
          <p className="about__description-paragraph">
            Promover educação de idiomas que seja{" "}
            <span className="about__description-paragraph--bold">
              acessível
            </span>
            ,{" "}
            <span className="about__description-paragraph--bold">
              divertida
            </span>{" "}
            e{" "}
            <span className="about__description-paragraph--bold">
              interativa
            </span>
            . Implementar o empoderamento intelectual por meio do ensino de
            idiomas visando reduzir a desigualdade de aprendizado e, por efeito,
            mitigar a desigualdade social.
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
                Paixão pela educação
              </div>
              <div className="about__values-item--text">
                Trabalhamos pela democratização da educação de idiomas no
                Brasil. Sabemos como a desigualdade social afeta as
                possibilidades de cada pessoa ao aprender idiomas, e buscamos
                reduzir esse dilema.
              </div>
            </div>
            <div className="about__values-item">
              <AiOutlineCompass className="about__values-item--icon" />
              <div className="about__values-item--heading">
                Comunicação sem fronteiras
              </div>
              <div className="about__values-item--text">
                Somos uma iniciativa online e queremos alcançar alunos de todo o
                Brasil: independente de renda, geografia ou nível de
                aprendizado. Queremos também expandir o projeto e ensinar
                múltiplos idiomas.
              </div>
            </div>
            <div className="about__values-item">
              <BiWinkSmile className="about__values-item--icon" />
              <div className="about__values-item--heading">
                Aprendizado pelo humor
              </div>
              <div className="about__values-item--text">
                Nada melhor do que um meme para provocar uma gargalhada num dia
                difícil, não é mesmo? E se você pudesse também aprender idiomas
                e cultura com eles? Nós do LangLev estamos aqui para isso!
              </div>
            </div>
          </div>
        </div>
        <div className="about__members">
          <div className="cool-heading about__members--heading u-margin-bottom-big">
            Conheça os linguarudos
          </div>
          <div className="about__members-grid">
            <TeamCard
              name="Arthur Melo"
              caption="fundador e diretor geral."
              picture={Arthur}
              alt="Arthur"
              Icon={AiOutlineCopyright}
              text="Sou natural de Imperatriz, Maranhão, Brasil. Sei das dificuldades de aprender um idioma sem todos os recursos financeiros para tal. Aprender inglês me trouxe oportunidades inesquecíveis, como meu primeiro intercâmbio para os EUA, ainda aos 17 anos, com tudo pago pelo Programa Jovens Embaixadores. Posteriormente, fui aceito com bolsa integral na faculdade Centre College, nos Estados Unidos, onde estudo atualmente. Ao criar o LangLev, estou feliz de trabalhar com voluntários dedicados ao ensino de idiomas de forma divertida: com memes. Minha meta foi criar um método inovador e motivador para alunos de todo o Brasil."
            />
            <TeamCard
              name="Turi Andrade"
              caption="coordenador de desenvolvimento de software."
              picture={Turi}
              alt="Turi"
              Icon={AiOutlineCode}
              text="Sou de Conselheiro Lafaiete em Minas Gerais. Comecei a me interessar por programação no Ensino Médio no IFMG - Campus Ouro Branco, onde também me formei paralelamente como Técnico em Informática. Atualmente, curso Ciência da Computação na UFMG e trabalho como desenvolvedor WEB. No meu tempo livre, alguns dos meus hobbies são tocar violão e guitarra, sair com meus amigos, jogar futebol e programar. Descobri o LangLev por meio de um amigo e, sabendo que o projeto precisava de um site, me propus a criar um!"
            />
            <TeamCard
              name="Emerson Aragão"
              caption="coordenador de redação."
              picture={Emy}
              alt="Emy"
              Icon={AiOutlineFileText}
              text="Sou formado em Licenciatura em Matemática e atualmente curso Bacharelado em Estatística pela Universidade de São Paulo. Sou apaixonado por Música, apesar de não saber tocar nenhum instrumento (ainda). Nascido e criado na periferia de São Paulo, dei um jeito de aprender inglês sem gastar um tostão e vi no projeto LangLev a oportunidade de ajudar outras pessoas a fazer o mesmo."
            />
            <TeamCard
              name="Iago Reis"
              caption="revisor e designer."
              picture={Iago}
              alt="Iago"
              Icon={AiOutlineAntDesign}
              text="Meu nome é Iago Reis, tenho 19 anos e sou de Conselheiro Lafaiete - Minas Gerais. Sou técnico em Informática pelo Instituto Federal de Educação, Ciência e Tecnologia de Minas Gerais - Campus Ouro Branco e, atualmente, curso Medicina na Universidade Federal de Lavras. No tempo livre, gosto de jogar futebol, pilotar, ler, estar com meus amigos e jogar no computador. Decidi fazer parte do LangLev por sempre ter demonstrado um interesse grande pela linguística e, além disso, por acreditar no potencial e nos ideais da equipe. Hoje, sou componente da equipe de Marketing e da equipe de Redação, atuando como revisor dos artigos que vão para o site."
            />
            <TeamCard
              name="Yasmin Madia"
              caption="coordenadora do LangLev Club."
              picture={Yasmin}
              alt="Yasmin"
              Icon={AiOutlineShareAlt}
              text="Meu nome é Yasmin Madia, eu sou do interior de São Paulo, atualmente estou em um ano sabático estudando espanhol e arte. Decidi entrar no LangLev para auxiliar estudantes no estudo de línguas estrangeiras e compartilhar as estratégias que uso."
            />
            <TeamCard
              name="Ana Alvim"
              caption="coordenadora de marketing."
              picture={AnaAlvim}
              alt="Ana"
              Icon={RiAdvertisementLine}
              text="Eu sou a Ana Beatriz Alvim, estou no terceiro ano do Ensino Médio e também cursando separadamente o Ensino técnico de publicidade. Meu sonho é trabalhar na área de Publicidade e nos meus tempos livres gosto de escutar músicas e assistir filmes/ séries, obviamente que em inglês! Eu decidi entrar no processo porque eu sei o quando o meu início de aprendizado foi sofrido por conta dos padrões de estudos de escolas tradicionais e a ideia da Langlev é uma forma inovadora de aprendizado!"
            />
            <TeamCard
              name="Pedro Henrique"
              caption="revisor e assistente de marketing."
              picture={PedroHenrique}
              alt="Pedro"
              Icon={AiOutlineFileText}
              text="Me chamo Pedro, sou entusiasta dos idiomas, gosto de história, filosofia e arte. Decidi fazer parte deste projeto por acreditar no aprendizado de idiomas como um instrumento para o desenvolvimento pessoal e profissional,  possibilitando principalmente aos jovens ter um diferencial para a conquista de seus objetivos."
            />
            <TeamCard
              name="Shara Hozanna"
              caption="revisora e designer."
              picture={Shara}
              alt="Shara"
              Icon={AiOutlineAntDesign}
              text="Olá! Me chamo Shara Hozana, curso Medicina e gosto muito de ciências e literatura. Meu hobby é ler gêneros literários e não literários, sempre há algo novo para aprender. Eu entrei no LangLev porque acredito que uma aprendizagem dinâmica pode ser muito eficaz e o projeto possibilita aprender Inglês de forma divertida e com dinamismo."
            />
            <TeamCard
              name="Estelito Neto"
              caption="consultor de idiomas e de conteúdo."
              picture={Estelito}
              alt="Estelito"
              Icon={FaLanguage}
              text="Professor Estelito Neto é graduado em Letras - Inglês pela UEMA (2013). Pós-graduado em Psicopedagogia pela FASERRA (2017). Já trabalhou como professor nas escolas UPTIME e  CIA (Curso de Inglês Acessível) e como professor substituto de Português/Inglês do IFMA campus Imperatriz. Atualmente é professor efetivo de Inglês do IFMA campus Buriticupu. Já foi intérprete em diversos eventos tendo como mais recentes duas conferências internacionais patrocinadas pela Associação Missão Cristã de Evangelismo Mundial.
            Entrei no projeto porque sou um amante de idiomas e tenho paixão pelo ensino."
            />
            <TeamCard
              name="Suziany Leite"
              caption="consultor de idiomas e de conteúdo."
              picture={Suziany}
              alt="Suziany"
              Icon={FaLanguage}
              text="Suziany Leite, professora do Instituto Federal do Maranhão, ministra aula nas disciplinas de língua portuguesa e língua inglesa no Campus avançado Porto Franco. Mestranda pela Must University - Flórida no curso de Tecnologias Emergentes da Educação. Como mãe, não tenho tempo livre, mas uso o mesmo para brincar e produzir materiais de ensino da língua inglesa pros meus filhos. Atualmente estudo sobre o bilinguismo infantil. Decidi entrar no projeto pois sou apaixonada pelo ensino de língua inglesa e a proposta de ensino através de memes é super inovadora. Quero colaborar e aprender junto com o grupo."
            />
            <TeamCard
              name="Zach Byerly"
              caption="consultor de TI e narrador de áudios."
              picture={Zach}
              alt="Zach"
              Icon={AiOutlineCode}
              text="Hi, my name is Zach.  I am an IT Analyst at Louisiana State University in Baton Rouge.  My wife grew up in Florianópolis and moved to the United States about 10 years ago.  I am learning Portuguese and I am excited to be contributing to the project any way I can!"
            />
            <TeamCard
              name="Brandon House"
              caption="narrador de áudios."
              picture={Brandon}
              alt="Brandon"
              Icon={AiOutlineAudio}
              text="Hey, I’m Brandon! I’m a Canadian living in South Western Ontario, near Toronto.  I  chose to join this project because I have a passion for languages and cultures. And believe education in these fields should be as accessible as possible for those looking to learn more about the world. I love to learn languages and am trilingual with English, Spanish and French (French more or less) under my belt. Beyond languages I love singing and playing piano and guitar!"
            />
            <TeamCard
              name="Sam Merritt"
              caption="narrador de áudios."
              picture={Sam}
              alt="Sam"
              Icon={AiOutlineAudio}
              text="Hello all! My name is Sam Merritt and I live in the United States. I’m 18 years old and will be a full time student at Centre College in the fall. In my free time I study foreign languages, geography, history, and the culture of various nations in the world. I decided to contribute to LangLev to accomplish an objective that I strongly believe in, creating free language learning resources for all."
            />
            <TeamCard
              name="Sarah Marie"
              caption="narradora de áudios."
              picture={SarahMarie}
              alt="Sarah"
              Icon={AiOutlineAudio}
              text="Hello everyone! I am Sarah, a Teacher of English at a high school in South London. I really enjoy reading, watching films and socialising with my friends. I decided to join the project because I teach a lot of students who are multilingual and I understand the difficulties of learning a new language. Lang Lev looks to overcome these with innovative ways that are really exciting."
            />
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
          <form className="footer__form" onSubmit={subscribe}>
            <div className="footer__form--heading">
              Se inscreva para receber toda semana nossa newsletter e se
              divertir enquanto aprende inglês!
            </div>
            <ControlledInput
              type="text"
              placeholder="Nome"
              state={name}
              setState={setName}
              error={errorName}
              inputClass="footer__form-input"
              errorClass="footer__form-error"
            />
            <ControlledInput
              type="text"
              placeholder="Email"
              state={email}
              setState={setEmail}
              error={errorEmail}
              inputClass="footer__form-input"
              errorClass="footer__form-error"
            />
            <button type="submit">Inscreva-se</button>
          </form>
          <div className="footer__bottom">
            <a
              href="https://twitter.com/langlevbrasil/"
              className="footer__social-link"
            >
              <FiTwitter />
            </a>
            <a
              href="https://www.instagram.com/langlevbrasil/"
              className="footer__social-link"
            >
              <FiInstagram />
            </a>
            <a
              href="https://chat.whatsapp.com/IQKtksqGJOBIpOpIsQ7gvL/"
              className="footer__social-link"
            >
              <FaWhatsapp />
            </a>
            <a
              href="https://www.facebook.com/LangLev-Language-Leverage-106112188113886/"
              className="footer__social-link"
            >
              <FiFacebook />
            </a>
          </div>
        </div>
        <div className="about__bottombar">
          <DefaultBottombar fullBorder />
        </div>
      </div>
    </>
  )
}

export default scrollToTop({ component: About })
