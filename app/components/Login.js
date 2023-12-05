// import node modules
import React, { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Axios from "axios"
import Cookies from "js-cookie"

// import components
import Page from "./Page"
import Container from "./Container"
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
  const url = navigate?.location?.state?.url || "/"

  // const ourRequest = Axios.CancelToken.source()
  const handleLogin = async e => {
    e.preventDefault()
    try {
      // if required fields blank
      if (!username || !password) {
        setError("required")
        return
      }

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
        setError(response.data.message)
        return
      }
      // else on success, set login details
      setError(false)
      // set cookie
      Cookies.set("token", response.data.token, { expires: 7, path: "/" })

      appDispatch({
        type: "login",
        username: response.data.username
      })
    } catch (e) {
      console.log(e)
    }
  }

  // navigate to protected pages once user is logged in
  useEffect(() => {
    if (appState.user) {
      console.log("state has user, rendering logged in")
      appDispatch({ type: "toast", value: "Logged in" })
      navigate(url)
    }
  }, [appState.user])

  return (
    <Page class="center-children">
      <Container class="card bgclr-light2">
        <form onSubmit={handleLogin} className="form-container">
          <h1>Log In</h1>
          {error === "required" && <div className="login-error">Please enter login details.</div>}
          {error === "invalid" && <div className="login-error">Invalid login details. Please try again.</div>}
          <div className="form-group">
            <label htmlFor="username">Username: </label>
            <input className={error ? "error-outline" : undefined} type="text" placeholder="Username" onChange={e => setUsername(e.target.value)} />
            <label htmlFor="password">Password: </label>
            <input className={error ? "error-outline" : undefined} type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
          </div>
          <button className="login-btn">Log in</button>
        </form>
      </Container>
    </Page>
  )
}

export default Login
