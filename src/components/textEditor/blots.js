import Quill from "quill"

const Inline = Quill.import("blots/inline")
const Block = Quill.import("blots/block")
const BlockEmbed = Quill.import("blots/block/embed")
const List = Quill.import("formats/list")

export class BoldBlot extends Inline {}
BoldBlot.blotName = "bold"
BoldBlot.tagName = "strong"
BoldBlot.className = "quill__bold"

export class ItalicBlot extends Inline {}
ItalicBlot.blotName = "italic"
ItalicBlot.tagName = "em"
ItalicBlot.className = "quill__italic"

export class BlockquoteBlot extends Block {}
BlockquoteBlot.blotName = "blockquote"
BlockquoteBlot.tagName = "blockquote"
BlockquoteBlot.className = "quill__blockquote"

export class ListBlot extends List {}
ListBlot.className = "quill__list"

export class HeaderBlot extends Block {
  static create(value) {
    const header = document.createElement("h1")

    if (value === 1) header.classList.add("quill__h1")
    if (value === 2) header.classList.add("quill__h2")

    return header
  }

  static formats(node) {
    return node.classList.contains("quill__h1") ? 1 : 2
  }
}
HeaderBlot.blotName = "header"
HeaderBlot.tagName = "h1"

export class LinkBlot extends Inline {
  static create(url) {
    let node = super.create()
    node.setAttribute("href", url)
    node.setAttribute("target", "_blank")
    node.addEventListener(
      "click",
      () => {
        window.open(url)
      },
      false
    ) // links only work like this in react
    return node
  }

  static formats(node) {
    return node.getAttribute("href")
  }
}
LinkBlot.blotName = "link"
LinkBlot.tagName = "a"
LinkBlot.className = "quill__link"

export class ImageBlot extends BlockEmbed {
  static create(value) {
    const imgWrapper = document.createElement("div")
    imgWrapper.classList.add("quill__image-wrapper")
    const imgElement = document.createElement("img")
    imgElement.classList.add("quill__image")

    imgElement.setAttribute("loading", "lazy")

    if (value.src) imgElement.setAttribute("src", value.src)
    if (value.alt) imgElement.setAttribute("alt", value.alt)
    if (value.key) imgElement.setAttribute("key", value.key)

    imgWrapper.appendChild(imgElement)
    return imgWrapper
  }

  static value(node) {
    const img = node.firstChild

    return {
      src: img.getAttribute("src"),
      alt: img.getAttribute("alt"),
      key: img.getAttribute("key"),
    }
  }
}

ImageBlot.blotName = "image"
ImageBlot.tagName = "div"
ImageBlot.className = "quill__image-wrapper"

export class VideoBlot extends BlockEmbed {
  static create(value) {
    const videoWrapper = document.createElement("div")
    videoWrapper.classList.add("quill__video-wrapper")
    const iframeElement = document.createElement("iframe")
    iframeElement.classList.add("quill__video")

    iframeElement.setAttribute("loading", "lazy")

    if (value.src) iframeElement.setAttribute("src", value.src)
    if (value.alt) iframeElement.setAttribute("alt", value.alt)
    if (value.key) iframeElement.setAttribute("key", value.key)
    iframeElement.setAttribute("allowfullscreen", true)

    videoWrapper.appendChild(iframeElement)
    return videoWrapper
  }

  static value(node) {
    const iframe = node.firstChild

    return {
      src: iframe.getAttribute("src"),
      alt: iframe.getAttribute("alt"),
      key: iframe.getAttribute("key"),
    }
  }
}

VideoBlot.blotName = "video"
VideoBlot.tagName = "div"
VideoBlot.className = "quill__video-wrapper"

export class AudioBlot extends BlockEmbed {
  static create(value) {
    const audioElement = document.createElement("audio")

    if (value.src) audioElement.setAttribute("src", value.src)
    if (value.alt) audioElement.setAttribute("alt", value.alt)
    if (value.key) audioElement.setAttribute("key", value.key)

    audioElement.setAttribute("controls", "")
    audioElement.classList.add("quill__audio")

    const audioWrapper = document.createElement("div")
    audioWrapper.classList.add("quill__audio-wrapper")

    audioWrapper.appendChild(audioElement)

    return audioWrapper
  }

  static value(node) {
    const audio = node.firstChild

    return {
      src: audio.getAttribute("src"),
      alt: audio.getAttribute("alt"),
      key: audio.getAttribute("key"),
    }
  }
}

AudioBlot.blotName = "audio"
AudioBlot.tagName = "div"
AudioBlot.className = "quill__audio-wrapper"
