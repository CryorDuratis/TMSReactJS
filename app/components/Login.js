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

  const [username, setUsername] = useState()
  const [password, setPassword] = useState()

  const ourRequest = Axios.CancelToken.source()
  async function handleSubmit(e) {
    e.preventDefault()
    try {
      const response = await Axios.post("/login", { username, password })
      appDispatch({ type: "toast", value: response.message })
      if (response.data) {
        useNavigate("/")
      }
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
    <Page>
      <Container>
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Username: </label>
          <input type="text" name="username" onChange={(e) => setUsername(e.target.value)} />
          <label htmlFor="password">Password: </label>
          <input type="password" name="password" onChange={(e) => setPassword(e.target.value)} />
          <button>Log in</button>
        </form>
      </Container>
    </Page>
  )
}

export default Login
