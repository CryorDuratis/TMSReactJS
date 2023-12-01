// import node modules
import React, { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import Axios from "axios"

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

  const ourRequest = Axios.CancelToken.source()
  async function handleSubmit(e) {
    e.preventDefault()
    try {
      // if required fields blank
      if (!username || !password) {
        setError("required")
        return
      }
      // send request -- check login
      var response = await Axios.post("/login/check")
      console.log(response.data)
      // if request fails
      if (response.data.error) {
        appDispatch({ type: "logerror", error: response.data.error })
        return
      }
      if (!response.data.loggedin) {
        // send request -- login form
        response = await Axios.post("/login", { username, password })
        console.log(response.data)

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
      }

      // else on success
      setError(false)
      appDispatch({ type: "login", username: response.data.username, usergroups: response.data.usergroups })
      console.log(appDispatch({ type: "login", username: response.data.username, usergroups: response.data.usergroups }))
      appDispatch({ type: "toast", value: "Logged in" })
      console.log(appState.loggedIn)
      navigate("/")
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <Page class="center-children">
      <Container class="card bgclr-light2">
        <form onSubmit={handleSubmit} className="form-container">
          <h1>Log In</h1>
          {error === "required" && <div className="login-error">Please enter login details.</div>}
          {error === "invalid" && <div className="login-error">Invalid login details. Please try again.</div>}
          <div className="form-group">
            <label htmlFor="username">Username: </label>
            <input className={error && "error-outline"} type="text" placeholder="Username" name="username" onChange={e => setUsername(e.target.value)} />
            <label htmlFor="password">Password: </label>
            <input className={error && "error-outline"} type="password" placeholder="Password" name="password" onChange={e => setPassword(e.target.value)} />
          </div>
          <button className="login-btn">Log in</button>
        </form>
      </Container>
    </Page>
  )
}

export default Login
