import React from "react"
import scrollToTop from "../../components/scrollToTop"
import ProfileCard from "../../components/profileCard"

function Editors() {
  return (
    <div className="users">
      <ProfileCard />
      <ProfileCard />
      <ProfileCard />
      <ProfileCard />
      <ProfileCard />
      <ProfileCard />
      <ProfileCard />
      <ProfileCard />
    </div>
  )
}

export default scrollToTop({ component: Editors })
