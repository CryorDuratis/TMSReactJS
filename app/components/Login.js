// import node modules
import React, { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Axios from "axios"
import Cookies from "js-cookie"

// import components
import Page from "../templates/Page"
import Container from "../templates/Container"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"

function Login() {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const navigate = useNavigate()

  // state of fields
  const [username, setUsername] = useState()
  const [password, setPassword] = useState()
  const [error, setError] = useState("") // for login page error rendering

  // const ourRequest = Axios.CancelToken.source()
  const handleLogin = async e => {
    e.preventDefault()
    setError(false)
    try {
      // send request -- login form
      const response = await Axios.post("/login", { username, password })
      console.log("login response: ", response.data)

      // if request fails
      if (response.data.error) {
        appDispatch({ type: "logerror", error: response.data.error })
        return
      }
      // if login fails
      if (!response.data.success) {
        setError(true)
        return
      }
      // else on success, set login details
      setError(false)
      // set cookie
      Cookies.set("token", response.data.token, { expires: 7, path: "/" })

      appDispatch({
        type: "login",
        user: response.data.username,
        message: "Logged in"
      })
      navigate("/apps")
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <Page class="center-children">
      <Container class="login-card bgclr-light2">
        <form onSubmit={handleLogin} className="login-container">
          <h1>Log In</h1>
          <div className="login-form-group">
            <label htmlFor="username">Username: </label>
            <input className={error ? "error-outline" : undefined} type="text" placeholder="Username" onChange={e => setUsername(e.target.value)} />
            <label htmlFor="password">Password: </label>
            <input className={error ? "error-outline" : undefined} type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
          </div>
          <div className={error ? "login-error error-box" : "login-error"}>Invalid login details.</div>
          <button className="login-btn">Log in</button>
        </form>
      </Container>
    </Page>
  )
}

export default Login
