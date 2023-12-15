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
import TaskDashboard from "./components/TaskDashboard"
import PlanMgmt from "./components/PlanMgmt"

// immerReducer enables state to be accessed throughout app
// initial state is empty

const initialState = {
  // for general use
  loading: true,
  user: "",
  overlay: false,
  toasts: [],
  toasttype: false,
  error: "",
  // for nested use
  admin: false
}

function reducer(draft, action) {
  switch (action.type) {
    // user session -----------------------------
    case "update":
      draft.user = action.user
      draft.loading = false
      return
    case "login":
      draft.user = action.user
      draft.toasts.push(action.message)
      draft.toasttype = true
      draft.loading = false
      return
    case "logout":
      draft.user = ""
      draft.overlay = false
      draft.toasts.push(action.message)
      draft.toasttype = true
      draft.loading = false
      return
    // toasts --------------------------------
    case "gtoast":
      draft.toasts.push(action.message)
      draft.toasttype = true
      return
    case "btoast":
      draft.toasts.push(action.message)
      draft.toasttype = false
      return
    // profile popup -------------------------
    case "profile":
      draft.overlay = !draft.overlay
      return
    case "closeprofile":
      draft.overlay = false
      return
    // SIDEBAR admin check
    case "admin":
      draft.admin = action.admin
      return
    // Server error
    case "error":
      draft.error = action.error
      return
  }
}

function MainComponent() {
  const [state, dispatch] = useImmerReducer(reducer, initialState)

  console.log("main state ", state)

  // check authentication and authorization on page load for display of buttons
  const fetchAuth = async () => {
    try {
      // check permissions: in this case only admin
      // Make authorization request to the server
      const token = Cookies.get("token")
      const response = await Axios.post("/checkgroup", { groupname: "admin", token })

      // if not logged in
      if (response.data.unauth === "login") {
        dispatch({
          type: "logout",
          message: "Logged out"
        })
      } else
        dispatch({
          type: "update",
          user: response.data.user
        })

      if (response.data.unauth === "role" && state.admin) {
        dispatch({
          type: "admin",
          admin: false
        })
      } else dispatch({ type: "admin", admin: true })
      if (response.data.error) {
        dispatch({
          type: "error",
          error: response.data.error
        })
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      // Handle errors as needed
      dispatch({
        type: "error",
        error: "server"
      })
    }
  }

  useEffect(() => {
    // Call the fetch function when the app first mounts
    fetchAuth()
  }, [])

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <Toast messages={state.toasts} />
          <Header />
          {state.overlay && <Profile />}
          {/* main body */}
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/apps" element={state.user ? <Home onLoad={fetchAuth} /> : state.loading ? <ErrorPage /> : <Login />} />
            <Route path="/" element={<Navigate to="/apps" replace />} />
            <Route path="/usermgmt" element={state.user ? <UserMgmt onLoad={fetchAuth} /> : state.loading ? <ErrorPage /> : <Login />} />
            <Route path="/apps/:appid" element={state.user ? <TaskDashboard onLoad={fetchAuth} /> : state.loading ? <ErrorPage /> : <Login />} />
            <Route path="/apps/:appid/plans" element={state.user ? <PlanMgmt onLoad={fetchAuth} /> : state.loading ? <ErrorPage /> : <Login />} />
            <Route path="/apps/:appid/task/:taskid" element={state.user ? <TaskDashboard onLoad={fetchAuth} /> : state.loading ? <ErrorPage /> : <Login />} />
            <Route path="/logout" element={<Navigate to="/login" replace />} />
            <Route path="/error" element={<ErrorPage />} />
            <Route path="*" element={<Navigate replace to="/error" />} />
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
