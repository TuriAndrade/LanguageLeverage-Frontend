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
} from "react-icons/all"

import {
  ItalicBlot,
  BoldBlot,
  BlockquoteBlot,
  HeaderBlot,
  LinkBlot,
  ImageBlot,
  VideoBlot,
  AudioBlot,
} from "./blots"

import { Link, LinkFile } from "./modals"

Quill.register(BoldBlot)
Quill.register(ItalicBlot)
Quill.register(BlockquoteBlot)
Quill.register(HeaderBlot)
Quill.register(LinkBlot)
Quill.register(ImageBlot)
Quill.register(VideoBlot)
Quill.register(AudioBlot)

export default class TextEditor extends Component {
  constructor(props) {
    super(props)
    this.editorContainer = React.createRef()

    this.state = {
      linkModalIn: false,
      linkFileModalIn: false,
    }
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

  componentDidMount() {
    this.editor = new Quill(this.editorContainer.current)

    const delta = {
      ops: [
        {
          insert: "Comece a escrever...",
        },
      ],
    }

    this.editor.setContents(delta)
  }

  render() {
    return (
      <div className="text-editor">
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
          <button className="text-editor__btn text-editor__btn--big">
            <BiImage />
          </button>
          <button className="text-editor__btn">
            <FiVideo />
          </button>
          <button className="text-editor__btn">
            <FaRegFileAudio />
          </button>
          <button
            onClick={() => {
              this.toggleLinkFileModal()
            }}
            className="text-editor__btn text-editor__btn--big"
          >
            <VscFileSymlinkFile />
          </button>
          <button className="text-editor__btn text-editor__btn--big text-editor__btn--green">
            <HiOutlineCloudUpload />
          </button>
        </div>
        <div className="text-editor__editor" ref={this.editorContainer}></div>
      </div>
    )
  }
}
