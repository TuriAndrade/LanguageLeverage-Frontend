import React from "react"
import scrollToTop from "../../components/scrollToTop"
import EditPost from "../../components/editPost"

function NewPost() {
  return <EditPost />
}

export default scrollToTop({ component: NewPost })
