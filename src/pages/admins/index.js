import React from "react"
import scrollToTop from "../../components/scrollToTop"
import ProfileCard from "../../components/profileCard"

function Admins() {
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

export default scrollToTop({ component: Admins })
