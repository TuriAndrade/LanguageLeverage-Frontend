import React from "react"
import scrollToTop from "../../components/scrollToTop"
import TextEditor from "../../components/textEditor"

function NewPost() {
  return <TextEditor />
}

export default scrollToTop({ component: NewPost })
