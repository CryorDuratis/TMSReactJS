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

// immerReducer enables state to be accessed throughout app
// initial state is empty

const initialState = {
  user: Cookies.get("kanbanuser"),
  toasts: [],
}

function reducer(draft, action) {
  switch (action.type) {
    case "login":
      draft.user = action.user
      draft.toasts.push(action.message)
      return
    case "logout":
      draft.user = ""
      draft.toasts.push(action.message)
      return
    case "toast":
      draft.toasts.push(action.message)
      return
  }
}

function MainComponent() {
  const [state, dispatch] = useImmerReducer(reducer, initialState)

  console.log("main state ", state)

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          {/* <Toast messages={state.toasts} /> */}
          <Header />
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
