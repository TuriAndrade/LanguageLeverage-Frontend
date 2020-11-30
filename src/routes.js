import React, { useState, useEffect, useLayoutEffect } from "react"
import { BrowserRouter, Switch, Route } from "react-router-dom"

import PublicRoute from "./components/publicRoute"
import PrivateRoute from "./components/privateRoute"

import {
  UserContext,
  CsrfContext,
  ThemeContext,
  LanguageContext,
} from "./components/context"

import authenticate from "./utils/authenticate"

import getCsrfToken from "./utils/getCsrfToken"

import Main from "./pages/main"
import Posts from "./pages/posts"
import Profile from "./pages/profile"
import Preferences from "./pages/preferences"
import Categories from "./pages/categories"
import Login from "./pages/login"
import Register from "./pages/register"
import About from "./pages/about"
import Trending from "./pages/trending"
import NotFound from "./pages/notFound"
import Logout from "./pages/logout"
import Editors from "./pages/editors"
import Admins from "./pages/admins"
import NewPost from "./pages/newPost"
import AllPosts from "./pages/allPosts"
import UpdatePost from "./pages/updatePost"
import PreviewPost from "./pages/previewPost"
import EditorPosts from ".//pages/editorPosts"

import { ProfileLayout, DefaultLayout } from "./components/layout"

export default function Routes() {
  const [user, setUser] = useState({
    loading: true,
  })
  const [csrfToken, setCsrfToken] = useState(null)
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark")
  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "pt"
  )

  useLayoutEffect(() => {
    document.documentElement.className = ""
    document.documentElement.classList.add(`theme-${theme}`)
  }, [theme])

  useEffect(() => {
    authenticate().then((response) => {
      setUser(response)
    })
  }, [setUser])

  useEffect(() => {
    getCsrfToken().then((response) => {
      setCsrfToken(response)
    })

    const interval = setInterval(() => {
      getCsrfToken().then((response) => {
        setCsrfToken(response)
      })
    }, 600000)

    return function cleanup() {
      clearInterval(interval)
    }
  }, [setCsrfToken])

  return (
    <BrowserRouter>
      <UserContext.Provider value={{ user, setUser }}>
        <CsrfContext.Provider value={{ csrfToken, setCsrfToken }}>
          <ThemeContext.Provider value={{ theme, setTheme }}>
            <LanguageContext.Provider value={{ language, setLanguage }}>
              <Switch>
                <PublicRoute
                  restricted={false}
                  path="/preferences"
                  component={Preferences}
                />
                <PublicRoute
                  restricted={false}
                  path="/categories"
                  component={Categories}
                />
                <PublicRoute
                  restricted={true}
                  path="/login"
                  component={Login}
                />
                <PublicRoute
                  restricted={true}
                  path="/register"
                  component={Register}
                />
                <Route
                  path={[
                    "/profile",
                    "/logout",
                    "/posts",
                    "/editors",
                    "/admins",
                    "/new/post",
                    "/all/posts",
                    "/update/post/:id",
                    "/preview/post/:id",
                    "/editor/posts/:editorId",
                  ]}
                  render={() => (
                    <ProfileLayout>
                      <Switch>
                        <PrivateRoute path="/profile" component={Profile} />
                        <PrivateRoute path="/logout" component={Logout} />
                        <PrivateRoute
                          path="/posts"
                          editorOnly
                          component={Posts}
                        />
                        <PrivateRoute
                          path="/editors"
                          adminOnly
                          component={Editors}
                        />
                        <PrivateRoute
                          path="/admins"
                          fullAdminOnly
                          component={Admins}
                        />
                        <PrivateRoute
                          path="/new/post"
                          validatedEditorOnly
                          component={NewPost}
                        />
                        <PrivateRoute
                          path="/update/post/:id"
                          validatedEditorOnly
                          component={UpdatePost}
                        />
                        <PrivateRoute
                          path="/preview/post/:id"
                          component={PreviewPost}
                        />
                        <PrivateRoute
                          path="/all/posts"
                          adminOnly
                          component={AllPosts}
                        />
                        <PrivateRoute
                          path="/editor/posts/:editorId"
                          adminOnly
                          component={EditorPosts}
                        />
                      </Switch>
                    </ProfileLayout>
                  )}
                />
                <Route
                  render={() => (
                    <DefaultLayout>
                      <Switch>
                        <PublicRoute
                          restricted={false}
                          exact
                          path="/"
                          component={Main}
                        />
                        <PublicRoute
                          restricted={false}
                          path="/about"
                          component={About}
                        />
                        <PublicRoute
                          restricted={false}
                          path="/trending"
                          component={Trending}
                        />
                        <PublicRoute restricted={false} component={NotFound} />
                      </Switch>
                    </DefaultLayout>
                  )}
                />
              </Switch>
            </LanguageContext.Provider>
          </ThemeContext.Provider>
        </CsrfContext.Provider>
      </UserContext.Provider>
    </BrowserRouter>
  )
}
