import React from "react"
import Post from "../../components/post"
import scrollToTop from "../../components/scrollToTop"

function Main() {
  return (
    <div className="feed">
      <Post />
      <Post />
      <Post />
      <Post />
    </div>
  )
}

export default scrollToTop({ component: Main })
