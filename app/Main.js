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
  updatelogin: 0,
  user: "",
  toasts: [],
  error: ""
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
      return
    case "logout":
      draft.user = ""
      return
    case "toast":
      draft.toasts.push(action.message)
      return
  }
}

function MainComponent() {
  const [state, dispatch] = useImmerReducer(reducer, initialState)
  const [isLoading, setIsLoading] = useState(true)

  // used to update login state based on cookie token
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get("token")
        // check if token possessed is valid
        const response = await Axios.post("/login/check", { token })
        console.log("response: ", response.data)
        if (response.data.error) {
          dispatch({
            type: "logerror",
            error: response.data.error
          })
        }
        if (response.data.loggedin) {
          // update login user details
          dispatch({
            type: "login",
            username: response.data.username
          })
        }
        if (!response || !response.data.loggedin) {
          dispatch({
            type: "logout"
          })
        }
        setIsLoading(false)
      } catch (e) {
        console.log(e)
      }
    }
    fetchData()
    console.log("main updated")
  }, [state.updatelogin])

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <Toast messages={state.toasts} />
          <Header />
          {/* main body */}
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={isLoading ? <ErrorPage /> : state.user ? <Dashboard></Dashboard> : <Navigate to="/login" url="/" replace />} />
            <Route
              path="/usermgmt"
              element={
                isLoading ? (
                  <ErrorPage />
                ) : state.user ? (
                  <Dashboard>
                    <UserList />
                  </Dashboard>
                ) : (
                  <Navigate to="/login" url="/usermgmt" replace />
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
