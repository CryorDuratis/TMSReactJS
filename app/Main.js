// import node modules
import React, { useEffect } from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useImmerReducer } from "use-immer"
import Axios from "axios"

Axios.defaults.baseURL = "http://localhost:3000"

import DispatchContext from "./DispatchContext"
import StateContext from "./StateContext"

// import components
import Header from "./components/Header"
import Login from "./components/Login"
import Dashboard from "./components/Dashboard"
import AppList from "./components/AppList"
import UserList from "./components/UserList"
import ErrorPage from "./components/ErrorPage"
import Footer from "./components/Footer"
import Toast from "./components/Toast"

function MainComponent() {
  const initialState = {
    loggedIn: Boolean(localStorage.getItem("kanbanToken")),
    toasts: [],
    user: {
      token: localStorage.getItem("kanbanToken"),
      username: localStorage.getItem("kanbanUsername"),
      email: localStorage.getItem("kanbanEmail"),
      groups: localStorage.getItem("kanbanGroups"),
    },
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
                state.loggedIn ? (
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
                state.loggedIn ? (
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
                state.loggedIn ? (
                  <Dashboard>
                    <UserList />
                  </Dashboard>
                ) : (
                  <Login />
                )
              }
            />
            <Route path="/logout" component={Login} />
            <Route path="/error" component={ErrorPage} />
            <Route component={ErrorPage} />
          </Routes>
          <Footer />
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
