import React, { useState } from "react"

import DefaultNavbar from "../defaultNavbar"
import ProfileNavbar from "../profileNavbar"

import DefaultSidebarLeft from "../defaultSidebarLeft"
import ProfileSidebarLeft from "../profileSidebarLeft"

import DefaultSidebarRight from "../defaultSidebarRight"

import DefaultBottombar from "../defaultBottombar"
import ProfileBottombar from "../profileBottombar"

import DefaultHiddenSidebar from "../defaultHiddenSidebar"

import { HiddenSidebarContext } from "../defaultHiddenSidebar/context"

export function DefaultLayout({ children }) {
  const [sidebarIn, setSidebarIn] = useState(false)

  return (
    <div className="container container--3c">
      <HiddenSidebarContext.Provider value={{ sidebarIn, setSidebarIn }}>
        <DefaultHiddenSidebar />
        <div className="container__navbar">
          <DefaultNavbar />
        </div>
        <div className="container__sidebar container__sidebar--left">
          <DefaultSidebarLeft />
        </div>
        <div className="container__bottombar">
          <DefaultBottombar />
        </div>
        <div className="container__sidebar container__sidebar--right">
          <DefaultSidebarRight />
        </div>
        <div className="container__main">{children}</div>
      </HiddenSidebarContext.Provider>
    </div>
  )
}

export function ProfileLayout({ children }) {
  return (
    <div className="container container--2c">
      <div className="container__navbar">
        <ProfileNavbar />
      </div>
      <div className="container__sidebar container__sidebar--left">
        <ProfileSidebarLeft />
      </div>
      <div className="container__bottombar">
        <ProfileBottombar />
      </div>
      <div className="container__main">{children}</div>
    </div>
  )
}
