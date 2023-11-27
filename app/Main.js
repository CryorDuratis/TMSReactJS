// import node modules
import React, { useEffect } from "react"
import ReactDOM from "react-dom/client"
import Cookies from "js-cookie"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useImmerReducer } from "use-immer"
import { Axios } from "axios"

Axios.defaults.baseURL = "http://localhost:3000"

import DispatchContext from "./DispatchContext"
import StateContext from "./StateContext"

// import components
import Header from "./components/Header"
import Login from "./components/Login"
import Dashboard from "./components/Dashboard"
import AppList from "./components/AppList"
import UserList from "./components/UserList"

function MainComponent() {
  const initialState = {
    loggedIn: Boolean(state.user.token),
    toasts: [],
    user: {
      token: Cookies.get("token")
    }
  }

  function reducer(draft, action) {
    switch (action.type) {
      case "login":
        draft.loggedIn = true
        return
      case "logout":
        draft.loggedIn = false
        return
      case "toast":
        draft.toasts.push(action.value)
        return
    }
  }

  const [state, dispatch] = useImmerReducer(reducer, initialState)

  useEffect(() => {
    if (state.loggedIn) {
    }
  }, [state.loggedIn])

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <Toast messages={state.toasts} />
          <Header />
          {/* main body */}
          <Routes>
            <Route
              path="/login"
              element={
                loggedIn ? (
                  <Dashboard>
                    <AppList />
                  </Dashboard>
                ) : (
                  <Login />
                )
              }
            />
            <Route
              path="/"
              element={
                loggedIn ? (
                  <Dashboard>
                    <AppList />
                  </Dashboard>
                ) : (
                  <Login />
                )
              }
            />
            <Route
              path="/admin"
              element={
                loggedIn ? (
                  <Dashboard>
                    <UserList />
                  </Dashboard>
                ) : (
                  <Login />
                )
              }
            />
            <Route path="/logout" element={<Login />} />
            <Route element={<NotFound />} />
          </Routes>
          {/* footer */}
          <footer></footer>
        </BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>
  )
}

const root = ReactDOM.createRoot(document.querySelector("#app"))
root.render(<MainComponent />)

if (module.hot) {
  module.hot.accept()
}
