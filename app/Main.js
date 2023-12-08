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
import ErrorPage from "./components/ErrorPage"
import Footer from "./components/Footer"
import Toast from "./components/Toast"
import Profile from "./components/Profile"
import Home from "./components/Home"
import UserMgmt from "./components/UserMgmt"

// immerReducer enables state to be accessed throughout app
// initial state is empty

const initialState = {
  user: "",
  usergroup: "",
  overlay: false,
  toasts: [],
  toasttype: false
}

function reducer(draft, action) {
  switch (action.type) {
    case "login":
      draft.user = action.user
      draft.toasts.push(action.message)
      draft.toasttype = true
      return
    case "logout":
      draft.user = ""
      draft.overlay = false
      draft.toasts.push(action.message)
      draft.toasttype = true
      return
    case "gtoast":
      draft.toasts.push(action.message)
      draft.toasttype = true
      return
    case "btoast":
      draft.toasts.push(action.message)
      draft.toasttype = false
      return
    case "profile":
      draft.overlay = !draft.overlay
      return
    case "closeprofile":
      draft.overlay = false
      return
  }
}

function MainComponent() {
  const [state, dispatch] = useImmerReducer(reducer, initialState)

  console.log("main state ", state)

  const handleClosePopup = () => {
    dispatch({ type: "closeprofile" })
  }

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <Toast messages={state.toasts} />
          <Header />
          {state.overlay && <Profile isOpen={state.overlay} onClose={handleClosePopup} />}
          {/* main body */}
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={state.user ? <Home /> : <Login />} />
            <Route path="/usermgmt" element={state.user ? <UserMgmt /> : <Login />} />
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
