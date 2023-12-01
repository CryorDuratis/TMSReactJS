// import node modules
import React, { useEffect } from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"
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
  loggedIn: false,
  toasts: [],
  username: "",
  usergroups: [],
  redirect: "",
  error: "",
}

function reducer(draft, action) {
  switch (action.type) {
    case "logerror":
      draft.error = action.error
      return
    case "login":
      draft.loggedIn = true
      draft.username = action.username
      draft.usergroups = action.usergroups
      return
    case "logout":
      draft.loggedIn = false
      draft.username = ""
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

  // used to set initial login state on page load from browser URL bar
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Axios.post("/login/check")
        console.log("initial log in: ", response.data)
        if (response.data.error) {
          dispatch({
            type: "logerror",
            error: response.data.error,
          })
        }
        if (response.data.loggedin) {
          dispatch({
            type: "login",
            username: response.data.username,
            usergroups: response.data.usergroups,
          })
        }
        console.log("intial state: ", state)
      } catch (e) {
        console.log(e)
      }
    }
    fetchData()
  }, [dispatch])

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <Toast messages={state.toasts} />
          <Header />
          {/* main body */}
          <Routes>
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
            <Route path="/login" element={<Login />} />
            <Route
              path="/usermgmt"
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
            <Route path="/logout" element={<Login />} />
            <Route path="/error" element={<ErrorPage />} />
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

if (module.hot) {
  module.hot.accept()
}
