import React from "react"
import scrollToTop from "../../components/scrollToTop"
import EditPost from "../../components/editPost"

function UpdatePost(props) {
  return <EditPost articleId={props.match.params.id} />
}

export default scrollToTop({ component: UpdatePost })
