// import node modules
import React, { useContext, useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import Axios from "axios"

// import components
import Page from "./Page"
import Container from "./Container"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"

function Login() {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  // state of form input fields
  const [username, setUsername] = useState()
  const [password, setPassword] = useState()

  const ourRequest = Axios.CancelToken.source()
  async function handleSubmit(e) {
    e.preventDefault()
    try {
      // validate password

      // send request
      const response = await Axios.post("/login/check", { username, password })

      // update state
      if (!response.loggedin) {
        appDispatch({
          type: "logout"
        })
      }

      appDispatch({ type: "toast", value: response.message })
    } catch (e) {
      console.log("There was a problem")
    }
  }

  const location = useLocation()
  const { pathname } = location

  function renderComponent() {
    if (pathname === "/logout") {
      // appDispatch()
    } else if (pathname !== "/login") {
    }
  }

  return (
    <Page class="center-children">
      <Container class="card bgclr-light2">
        <form onSubmit={handleSubmit} className="form-container">
          <h1>Log In</h1>
          <div className="form-group">
            <label htmlFor="username">Username: </label>
            <input type="text" name="username" onChange={e => setUsername(e.target.value)} />
            <label htmlFor="password">Password: </label>
            <input type="password" name="password" onChange={e => setPassword(e.target.value)} />
          </div>
          <button className="login-btn">Log in</button>
        </form>
      </Container>
    </Page>
  )
}

export default Login
