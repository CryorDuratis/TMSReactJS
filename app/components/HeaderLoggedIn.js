import React, { useContext } from "react"
import Container from "./Container"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"
import Axios from "axios"
import { useNavigate } from "react-router-dom"

function HeaderLoggedIn(props) {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const navigate = useNavigate()

  async function logout() {
    try {
      // send request -- check login
      const response = await Axios.post("/login/check")
      // if request fails
      if (response.data.error) {
        appDispatch({ type: "logerror", error: response.data.error })
        return
      }
      if (!response.data.loggedin) {
        // send request -- logout
        response = await Axios.post("/logout")

        // if request fails
        if (response.data.error) {
          appDispatch({ type: "logerror", error: response.data.error })
          return
        }
      }
      // else on success
      appDispatch({ type: "logout" })
      appDispatch({ type: "toast", value: "Logged out" })
      console.log(appState.loggedIn)
      navigate("/login")
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <Container class={"header-grp"}>
      <button className="header-btn">
        <img src="profile.png" className="avatar" />
        Username &#9660;
      </button>
      <button className="header-btn" onClick={logout}>
        <img src="logout.png" className="icon" />
        Log out
      </button>
    </Container>
  )
}

export default HeaderLoggedIn
