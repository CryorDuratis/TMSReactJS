// import node modules
import React, { useEffect } from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useImmerReducer } from "use-immer"
import Axios from "axios"

Axios.defaults.baseURL = "http://localhost:3001"
Axios.defaults.withCredentials = true

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

// immerReducer enables state to be accessed throughout app
// initial state is empty

const initialState = {
  updatelogin: 0,
  user: "",
  usergroups: [],
  toasts: [],
  redirect: "",
  isloading: false,
  error: "",
}

function reducer(draft, action) {
  switch (action.type) {
    case "update":
      draft.updatelogin++
      return
    case "logerror":
      draft.error = action.error
      return
    case "login":
      draft.user = action.username
      draft.usergroups = action.usergroups
      return
    case "logout":
      draft.user = ""
      draft.usergroups = []
      return
    case "setrdt":
      draft.redirect = action.url
      return
    case "clearrdt":
      draft.redirect = ""
      return
    case "toast":
      draft.toasts.push(action.message)
      return
  }
}

function MainComponent() {
  const [state, dispatch] = useImmerReducer(reducer, initialState)

  // used to update login state based on localstorage - matches cookie token
  useEffect(() => {
    const fetchData = async () => {
      try {
        // check if localstorage indicates logged in
        if (!localStorage.getItem("kanbanloggedin")) {
          dispatch({
            type: "logout",
          })
          return
        }
        // check if token possessed is valid
        const response = await Axios.post("/login/check")
        if (response.data.error) {
          dispatch({
            type: "logerror",
            error: response.data.error,
          })
        }
        if (response.data.loggedin) {
          // update login user details
          dispatch({
            type: "login",
            username: response.data.username,
            usergroups: response.data.usergroups,
          })
        }
        if (!response) {
          localStorage.removeItem("kanbanloggedin")
          dispatch({
            type: "logout",
          })
        }
      } catch (e) {
        console.log(e)
      }
    }
    fetchData()
    console.log("main useeffect: ", state)
  }, [state.updatelogin])

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <Toast messages={state.toasts} />
          <Header />
          {/* main body */}
          <Routes>
            {state.error && <Route element={<ErrorPage />} />}
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                state.user ? (
                  <Dashboard>
                    <AppList />
                  </Dashboard>
                ) : (
                  <Navigate to="/login" url="/" replace />
                )
              }
            />
            <Route
              path="/usermgmt"
              element={
                state.user ? (
                  <Dashboard>
                    <UserList />
                  </Dashboard>
                ) : (
                  <Navigate to="/login" url="/usermgmt" replace />
                )
              }
            />
            <Route path="/logout" element={<Navigate to="/login" replace />} />
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
