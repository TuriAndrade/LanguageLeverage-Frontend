import React, { Component } from "react"
import Quill from "quill"
import {
  AiOutlineBold,
  AiOutlineItalic,
  AiOutlineLink,
  FaHeading,
  FaQuoteRight,
  BiImage,
  FiVideo,
  FaRegFileAudio,
  VscFileSymlinkFile,
  HiOutlineCloudUpload,
  AiOutlineUnorderedList,
  AiOutlineOrderedList,
} from "react-icons/all"

import { Link, LinkFile, Upload } from "./modals"

import api from "../../services/api"
import { CsrfContext } from "../context"

import PopupMessage from "../popupMessage"

import { isEqual } from "lodash"
import "quill-paste-smart"

import {
  ItalicBlot,
  BoldBlot,
  BlockquoteBlot,
  HeaderBlot,
  LinkBlot,
  ImageBlot,
  VideoBlot,
  AudioBlot,
  ListBlot,
} from "./blots"

Quill.register(BoldBlot)
Quill.register(ItalicBlot)
Quill.register(BlockquoteBlot)
Quill.register(HeaderBlot)
Quill.register(LinkBlot)
Quill.register(ImageBlot)
Quill.register(VideoBlot)
Quill.register(AudioBlot)
Quill.register(ListBlot)

export default class TextEditor extends Component {
  initDelta
  onSubmit

  constructor(props) {
    super(props)
    this.editorContainer = React.createRef()

    this.state = {
      linkModalIn: false,
      linkFileModalIn: false,
      isUploadingFile: false,
      uploadProgress: 0,
      uploadError: null,
      popupIn: false,
    }
  }

  static contextType = CsrfContext

  componentDidMount() {
    this.editor = new Quill(this.editorContainer.current, {
      modules: {
        clipboard: {
          allowed: {
            tags: [
              "a",
              "b",
              "strong",
              "u",
              "s",
              "i",
              "p",
              "br",
              "ul",
              "ol",
              "li",
              "span",
            ],
            attributes: ["href", "rel", "target", "class"],
          },
          keepSelection: true,
        },
      },
    })

    const delta = {
      ops: [
        {
          insert: "Comece a escrever ...",
        },
      ],
    }

    this.editor.setContents(this.props.initDelta || delta)
  }

  componentDidUpdate(prevProps, prevState) {
    if (!isEqual(prevProps.initDelta, this.props.initDelta)) {
      this.editor.setContents(this.props.initDelta)
    }
  }

  setPopupIn = (newState) => {
    this.setState({
      popupIn: newState,
    })
  }

  setUploadError = (newState) => {
    this.setState({
      uploadError: newState,
    })
  }

  toggleLinkModal = () => {
    this.setState((prevstate) => ({
      linkModalIn: !prevstate.linkModalIn,
    }))
  }

  toggleLinkFileModal = () => {
    this.setState((prevstate) => ({
      linkFileModalIn: !prevstate.linkFileModalIn,
    }))
  }

  insertFile = (e, fileType) => {
    if (
      e.currentTarget &&
      e.currentTarget.files &&
      e.currentTarget.files.length > 0 &&
      this.editor
    ) {
      const file = e.currentTarget.files[0]

      let formData = new FormData()

      formData.append("file", file)

      e.currentTarget.value = null
      e.target.value = null

      api
        .post("/upload/file", formData, {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
            csrftoken: this.context.csrfToken,
          },
          onUploadProgress: (e) => {
            if (e.total > e.loaded) {
              this.setState({
                isUploadingFile: true,
                uploadProgress: parseInt(
                  Math.round((e.loaded * 100) / e.total)
                ),
              })
            } else {
              this.setState({
                isUploadingFile: false,
                uploadProgress: 0,
              })
            }
          },
        })
        .then((response) => {
          this.editor.focus()

          const range = this.editor.getSelection(true)
          const position = range ? range.index : 0

          this.editor.insertEmbed(
            position,
            fileType,
            {
              src: response.data.link,
              alt: response.data.originalname,
              key: response.data.key,
            },
            Quill.sources.USER
          )
          this.editor.setSelection(position + 1, Quill.sources.SILENT)

          const selectionEl = window.getSelection().focusNode
          selectionEl.scrollIntoView(true)
        })
        .catch((e) => {
          if (
            e.response &&
            e.response.data &&
            e.response.data.error === "Invalid type!"
          ) {
            this.setUploadError("Tipo de arquivo inválido!")
          } else if (
            e.response &&
            e.response.data &&
            e.response.data.error === "File too large"
          ) {
            this.setUploadError("Arquivo muito grande!")
          } else {
            this.setUploadError("Algum erro ocorreu!")
          }

          this.setPopupIn(true)
        })
        .finally(() =>
          this.setState({
            isUploadingFile: false,
            uploadProgress: 0,
          })
        )
    }
  }

  render() {
    return (
      <div className="text-editor">
        <PopupMessage
          modalIn={this.state.popupIn}
          setModalIn={this.setPopupIn}
          error={this.state.uploadError}
          setError={this.setUploadError}
        />
        <Link
          editor={this.editor}
          modalIn={this.state.linkModalIn}
          toggleModal={this.toggleLinkModal}
        />
        <LinkFile
          Quill={Quill}
          editor={this.editor}
          modalIn={this.state.linkFileModalIn}
          toggleModal={this.toggleLinkFileModal}
        />
        <Upload
          modalIn={this.state.isUploadingFile}
          uploadProgress={this.state.uploadProgress}
        />
        <div className="text-editor__toolbar">
          <button
            onClick={() => {
              if (this.editor) {
                const format = this.editor.getFormat()

                if (format) {
                  this.editor.format("bold", !format.bold)
                }
              }
            }}
            className="text-editor__btn"
          >
            <AiOutlineBold />
          </button>
          <button
            onClick={() => {
              if (this.editor) {
                const format = this.editor.getFormat()

                if (format) {
                  this.editor.format("italic", !format.italic)
                }
              }
            }}
            className="text-editor__btn"
          >
            <AiOutlineItalic />
          </button>
          <button
            onClick={() => {
              this.toggleLinkModal()
            }}
            className="text-editor__btn"
          >
            <AiOutlineLink />
          </button>
          <button
            onClick={() => {
              if (this.editor) {
                const format = this.editor.getFormat()

                if (format) {
                  this.editor.format("blockquote", !format.blockquote)
                }
              }
            }}
            className="text-editor__btn"
          >
            <FaQuoteRight />
          </button>
          <button
            onClick={() => {
              if (this.editor) {
                const format = this.editor.getFormat()

                if (format) {
                  this.editor.format("header", format.header === 1 ? false : 1)
                }
              }
            }}
            className="text-editor__btn"
          >
            <FaHeading />
          </button>
          <button
            onClick={() => {
              if (this.editor) {
                const format = this.editor.getFormat()

                if (format) {
                  this.editor.format("header", format.header === 2 ? false : 2)
                }
              }
            }}
            className="text-editor__btn text-editor__btn--small"
          >
            <FaHeading />
          </button>
          <button
            onClick={() => {
              if (this.editor) {
                const format = this.editor.getFormat()

                if (format) {
                  this.editor.format(
                    "list",
                    format.list === "bullet" ? false : "bullet"
                  )
                }
              }
            }}
            className="text-editor__btn text-editor__btn--big"
          >
            <AiOutlineUnorderedList />
          </button>
          <button
            onClick={() => {
              if (this.editor) {
                const format = this.editor.getFormat()

                if (format) {
                  this.editor.format(
                    "list",
                    format.list === "ordered" ? null : "ordered"
                  )
                }
              }
            }}
            className="text-editor__btn text-editor__btn--big"
          >
            <AiOutlineOrderedList />
          </button>
          <label
            htmlFor="text-editor__insert-image"
            className="text-editor__btn text-editor__btn--big"
          >
            <BiImage />
          </label>
          <input
            onChange={(e) => this.insertFile(e, "image")}
            id="text-editor__insert-image"
            type="file"
            className="text-editor__file-input"
          />
          <label
            htmlFor="text-editor__insert-video"
            className="text-editor__btn"
          >
            <FiVideo />
          </label>
          <input
            onChange={(e) => this.insertFile(e, "video")}
            id="text-editor__insert-video"
            type="file"
            className="text-editor__file-input"
          />
          <label
            htmlFor="text-editor__insert-audio"
            className="text-editor__btn"
          >
            <FaRegFileAudio />
          </label>
          <input
            onChange={(e) => this.insertFile(e, "audio")}
            id="text-editor__insert-audio"
            type="file"
            className="text-editor__file-input"
          />
          <button
            onClick={() => {
              this.toggleLinkFileModal()
            }}
            className="text-editor__btn text-editor__btn--big"
          >
            <VscFileSymlinkFile />
          </button>
          <button
            onClick={() => {
              this.props.onSubmit({
                html: this.editor.root.innerHTML,
                delta: this.editor.getContents(),
              })
            }}
            className="text-editor__btn text-editor__btn--big text-editor__btn--green"
          >
            <HiOutlineCloudUpload />
          </button>
        </div>
        <div className="text-editor__editor" ref={this.editorContainer}></div>
      </div>
    )
  }
}
