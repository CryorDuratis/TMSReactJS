// import node modules
import React, { useEffect, useState } from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useImmerReducer } from "use-immer"
import Axios from "axios"
import Cookies from "js-cookie"

Axios.defaults.baseURL = "http://localhost:3001"
// Axios.defaults.withCredentials = true

import DispatchContext from "./DispatchContext"
import StateContext from "./StateContext"

// import components
import Header from "./components/Header"
import Login from "./components/Login"
import Dashboard from "./components/Dashboard"
import UserList from "./components/UserList"
import ErrorPage from "./components/ErrorPage"
import Footer from "./components/Footer"
import Toast from "./components/Toast"
import Profile from "./components/Profile"

// immerReducer enables state to be accessed throughout app
// initial state is empty

const initialState = {
  user: Cookies.get("kanbanuser"),
  overlay: false,
  gtoasts: [],
  btoasts: []
}

function reducer(draft, action) {
  switch (action.type) {
    case "login":
      draft.user = action.user
      draft.gtoasts.push(action.message)
      return
    case "logout":
      draft.user = ""
      draft.overlay = false
      draft.gtoasts.push(action.message)
      return
    case "gtoast":
      draft.gtoasts.push(action.message)
      return
    case "btoast":
      draft.btoasts.push(action.message)
      return
    case "profile":
      draft.overlay = !draft.overlay
  }
}

function MainComponent() {
  const [state, dispatch] = useImmerReducer(reducer, initialState)

  console.log("main state ", state)

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <Toast gmessages={state.gtoasts} bmessages={state.btoasts} />
          <Header />
          {state.overlay && <Profile />}
          {/* main body */}
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={state.user ? <Dashboard /> : <Login />} />
            <Route
              path="/usermgmt"
              element={
                state.user ? (
                  <Dashboard>
                    <UserList />
                  </Dashboard>
                ) : (
                  <Login />
                )
              }
            />
            <Route path="/logout" element={<Navigate to="/login" replace />} />
            <Route element={<ErrorPage />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>
  )
}

const root = ReactDOM.createRoot(document.querySelector("#app"))
root.render(<MainComponent />)

// if (module.hot) {
//   module.hot.accept()
// }
