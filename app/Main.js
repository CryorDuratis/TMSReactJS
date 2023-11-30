// import node modules
import React, { useEffect } from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
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
  // immerReducer enables state to be accessed throughout app
  // initial state is empty
  const initialState = {
    loggedIn: false,
    toasts: [],
    username: "",
    usergroups: [],
    redirect: ""
  }

  function reducer(draft, action) {
    switch (action.type) {
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

  const [state, dispatch] = useImmerReducer(reducer, initialState)

  // used to set initial login state on page load from browser URL bar
  useEffect(async () => {
    try {
      const { pathname } = useLocation()
      const response = await Axios.post("/login")
      if (!response.loggedin && pathname !== "/login") {
        appDispatch({
          type: "toast",
          message: "Please log in first",
          url: pathname
        })
      }
      if (response.loggedin && pathname === "/login") {
        appDispatch({
          type: "toast",
          message: "Logged in"
        })
      }
      if (response.loggedin) {
        appDispatch({
          type: "login",
          username: response.username,
          usergroups: response.usergroups
        })
      }
    } catch (e) {
      console.log("There was a problem")
    }
  }, [])

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <Toast messages={state.toasts} />
          <Header />
          {/* main body */}
          <Routes>
            <Route
              path={["/login", "/"]}
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
